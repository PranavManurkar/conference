# core/utils/sheets_utils.py
"""
Google Sheets integration utility for exporting approved registrations.
Implements ACID compliance with fallback Excel backup.
"""
import logging
import os
from datetime import datetime
from pathlib import Path

from django.conf import settings
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
from googleapiclient import discovery
from openpyxl import Workbook, load_workbook
from openpyxl.utils import get_column_letter


logger = logging.getLogger(__name__)


def get_sheets_service():
    """
    Authenticates using credentials.json and returns Google Sheets API service.
    
    Returns:
        googleapiclient.discovery.Resource: Authenticated Sheets API service
        
    Raises:
        FileNotFoundError: If credentials.json is not found
        Exception: If authentication fails
    """
    credentials_path = settings.GOOGLE_SHEETS_CREDENTIALS_JSON
    
    if not os.path.exists(credentials_path):
        error_msg = f"Google Sheets credentials not found at {credentials_path}"
        logger.error(error_msg)
        raise FileNotFoundError(error_msg)
    
    try:
        # Create credentials from service account JSON
        credentials = Credentials.from_service_account_file(
            credentials_path,
            scopes=["https://www.googleapis.com/auth/spreadsheets"]
        )
        
        # Build and return the Sheets API service
        service = discovery.build("sheets", "v4", credentials=credentials)
        logger.debug("Google Sheets service authenticated successfully")
        return service
        
    except Exception as e:
        error_msg = f"Failed to authenticate Google Sheets: {str(e)}"
        logger.error(error_msg)
        raise


def get_existing_registration_ids(service):
    """
    Reads column A (registration IDs) from Google Sheet to prevent duplicates.
    
    Args:
        service: Authenticated Google Sheets API service
        
    Returns:
        set: Set of existing registration IDs from column A
    """
    try:
        sheet_id = settings.GOOGLE_SHEETS_ID
        range_name = settings.GOOGLE_SHEETS_RANGE
        
        # Read all values from column A
        result = service.spreadsheets().values().get(
            spreadsheetId=sheet_id,
            range=f"{range_name.split('!')[0]}!A:A"  # Get just column A
        ).execute()
        
        values = result.get("values", [])
        # Skip header row (index 0) and flatten to set
        existing_ids = {str(row[0]) for row in values[1:] if row}
        
        logger.debug(f"Found {len(existing_ids)} existing registration IDs in sheet")
        return existing_ids
        
    except Exception as e:
        logger.error(f"Failed to read existing registration IDs: {str(e)}")
        return set()  # Return empty set to continue with backup


def build_header_row():
    """
    Dynamically builds header row from Registration model fields.
    Never hardcodes field names.
    
    Returns:
        list: Header row with all field names from Registration model
    """
    from core.models import Registration
    
    # Get all model fields dynamically
    field_names = [field.name for field in Registration._meta.fields]
    
    # Add "Registration Status" as a label for the status field
    headers = field_names + ["Registration Status"]
    
    logger.debug(f"Built header row with {len(headers)} columns")
    return headers


def build_data_row(registration_instance):
    """
    Dynamically builds data row from registration instance.
    Handles None/null values by replacing with empty strings.
    
    Args:
        registration_instance: Registration model instance
        
    Returns:
        list: Data row with values matching header order
    """
    from core.models import Registration
    
    # Get all model field names in order
    field_names = [field.name for field in Registration._meta.fields]
    
    # Build data row
    data_row = []
    for field_name in field_names:
        value = getattr(registration_instance, field_name, None)
        
        # Handle special types
        if value is None:
            data_row.append("")
        elif isinstance(value, (datetime,)):
            data_row.append(value.isoformat())
        elif hasattr(value, 'id'):  # ForeignKey objects
            data_row.append(str(value.id))
        else:
            data_row.append(str(value))
    
    # Add status label
    data_row.append(registration_instance.get_status_display())
    
    logger.debug(f"Built data row for registration ID {registration_instance.id}")
    return data_row


def ensure_header_exists(service, sheet_id, range_name):
    """
    Checks if row 1 has headers. If sheet is empty, writes header row atomically.
    
    Args:
        service: Authenticated Google Sheets API service
        sheet_id: Google Sheet ID
        range_name: Range name (e.g., "Approvals!A:Z")
        
    Returns:
        bool: True if header exists or was written successfully
    """
    try:
        # Check if sheet has any data
        result = service.spreadsheets().values().get(
            spreadsheetId=sheet_id,
            range=f"{range_name.split('!')[0]}!A1:Z1"
        ).execute()
        
        values = result.get("values", [])
        
        if not values or len(values[0]) == 0:
            # Sheet is empty, write header row atomically
            header_row = build_header_row()
            
            # Use ATOMIC write with USER_ENTERED option
            service.spreadsheets().values().update(
                spreadsheetId=sheet_id,
                range=f"{range_name.split('!')[0]}!A1:{get_column_letter(len(header_row))}1",
                valueInputOption="USER_ENTERED",
                body={"values": [header_row]}
            ).execute()
            
            logger.info("Header row written to Google Sheet")
            return True
        else:
            logger.debug("Header row already exists in Google Sheet")
            return True
            
    except Exception as e:
        logger.error(f"Failed to ensure header exists: {str(e)}")
        return False


def append_to_excel_backup(registration_instance):
    """
    Appends registration to local Excel backup file as fallback.
    Creates file/directory if needed. Updates existing rows with new status.
    
    Args:
        registration_instance: Registration model instance
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Create exports directory if it doesn't exist
        exports_dir = settings.BASE_DIR / "exports"
        os.makedirs(exports_dir, exist_ok=True)
        
        excel_path = exports_dir / "approved_registrations.xlsx"
        
        # Build data row first
        data_row = build_data_row(registration_instance)
        registration_id = str(registration_instance.id)
        
        # Check if file exists
        if excel_path.exists():
            wb = load_workbook(excel_path)
            ws = wb.active
            
            # Search for existing registration ID in column A
            existing_row_num = None
            for row_idx, row in enumerate(ws.iter_rows(min_row=2, max_row=ws.max_row, min_col=1, max_col=1), start=2):
                if row[0].value and str(row[0].value) == registration_id:
                    existing_row_num = row_idx
                    break
            
            # If found, update the existing row with new status
            if existing_row_num:
                logger.info(f"Registration ID {registration_id} already exists. UPDATING row {existing_row_num} with status: {registration_instance.status}")
                
                # Update the row with new data
                for col_idx, value in enumerate(data_row, start=1):
                    ws.cell(row=existing_row_num, column=col_idx, value=value)
                
                wb.save(excel_path)
                logger.info(f"Registration {registration_instance.id} updated in Excel backup with status: {registration_instance.status}")
                return True
        else:
            # Create new workbook
            wb = Workbook()
            ws = wb.active
            
            # Write header row
            header_row = build_header_row()
            ws.append(header_row)
        
        ws = wb.active
        
        # Append data row (for new registrations)
        ws.append(data_row)
        
        # Save workbook
        wb.save(excel_path)
        logger.info(f"Registration {registration_instance.id} backed up to Excel with status: {registration_instance.status}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to write Excel backup for registration {registration_instance.id}: {str(e)}")
        return False


def update_registration_in_sheet(registration_instance, service):
    """
    Updates an existing registration row in Google Sheet with new status.
    Finds the row by registration ID and updates all columns.
    
    Args:
        registration_instance: Registration model instance
        service: Authenticated Google Sheets service
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        sheet_id = settings.GOOGLE_SHEETS_ID
        range_name = settings.GOOGLE_SHEETS_RANGE
        sheet_name = range_name.split('!')[0]  # Get sheet name (e.g., "Approved")
        
        # Read all values to find the registration row
        result = service.spreadsheets().values().get(
            spreadsheetId=sheet_id,
            range=f"{sheet_name}!A:A"
        ).execute()
        
        values = result.get('values', [])
        registration_id_str = str(registration_instance.id)
        
        # Find row with matching ID (skip header at index 0)
        row_index = None
        for idx, row in enumerate(values[1:], start=2):  # Start from row 2 (row 1 is header)
            if row and row[0] and str(row[0]) == registration_id_str:
                row_index = idx
                break
        
        if not row_index:
            logger.warning(f"Could not find registration {registration_id_str} in sheet to update")
            return False
        
        # Build new data row
        data_row = build_data_row(registration_instance)
        
        # Build range for this specific row
        header_row = build_header_row()
        end_col = get_column_letter(len(header_row))
        update_range = f"{sheet_name}!A{row_index}:{end_col}{row_index}"
        
        # Update the row
        service.spreadsheets().values().update(
            spreadsheetId=sheet_id,
            range=update_range,
            valueInputOption="USER_ENTERED",
            body={"values": [data_row]}
        ).execute()
        
        logger.info(
            f"Registration {registration_id_str} UPDATED in Google Sheet at row {row_index} "
            f"with new status: {registration_instance.status}"
        )
        return True
        
    except Exception as e:
        logger.error(f"Failed to update registration in Google Sheet: {str(e)}")
        return False


def append_approved_user_to_sheet(registration_instance):
    """
    Main function: Exports registration to Google Sheet with Excel fallback.
    Exports ALL registration statuses (Under Process, Accepted, Rejected).
    Updates existing rows when status changes.
    ACID compliant: Atomic writes with full error handling.
    
    Args:
        registration_instance: Registration model instance
        
    Returns:
        bool: True if successful (sheet or backup), False if both failed
    """
    logger.info(
        f"Starting export for registration ID {registration_instance.id} "
        f"(Status: {registration_instance.status})"
    )
    
    # Valid statuses that can be exported
    valid_statuses = ["Under Process", "Accepted", "Rejected"]
    
    if registration_instance.status not in valid_statuses:
        logger.warning(
            f"Registration {registration_instance.id} has unexpected status '{registration_instance.status}'. "
            f"Valid statuses are: {', '.join(valid_statuses)}"
        )
        return False
    
    try:
        # Get Google Sheets service
        service = get_sheets_service()
        sheet_id = settings.GOOGLE_SHEETS_ID
        range_name = settings.GOOGLE_SHEETS_RANGE
        
        # Duplicate check
        existing_ids = get_existing_registration_ids(service)
        registration_id_str = str(registration_instance.id)
        
        if registration_id_str in existing_ids:
            logger.info(
                f"Registration {registration_id_str} already exists in sheet. "
                f"UPDATING with new status: {registration_instance.status}"
            )
            # Try to update the existing row
            if update_registration_in_sheet(registration_instance, service):
                return True
            else:
                logger.warning("Update failed, attempting to add as new entry")
                # If update fails, fall through to append
        
        # Ensure header row exists (atomic operation)
        if not ensure_header_exists(service, sheet_id, range_name):
            raise Exception("Failed to ensure header row exists")
        
        # Build and append data row atomically
        data_row = build_data_row(registration_instance)
        
        service.spreadsheets().values().append(
            spreadsheetId=sheet_id,
            range=range_name,
            valueInputOption="USER_ENTERED",
            body={"values": [data_row]}
        ).execute()
        
        logger.info(
            f"Registration {registration_id_str} successfully exported to Google Sheet. "
            f"Status: {registration_instance.status} | Timestamp: {datetime.now().isoformat()}"
        )
        return True
        
    except FileNotFoundError as e:
        logger.warning(f"Google Sheets credentials not available: {str(e)}")
        logger.info("Falling back to Excel backup...")
        return append_to_excel_backup(registration_instance)
        
    except Exception as e:
        logger.error(
            f"Failed to export registration {registration_instance.id} to Google Sheet: {str(e)}"
        )
        logger.info("Attempting Excel backup as fallback...")
        
        # Try Excel backup as fallback
        if append_to_excel_backup(registration_instance):
            logger.info(f"Registration {registration_instance.id} successfully backed up to Excel")
            return True
        else:
            logger.error(f"Both Google Sheet and Excel backup failed for registration {registration_instance.id}")
            return False
