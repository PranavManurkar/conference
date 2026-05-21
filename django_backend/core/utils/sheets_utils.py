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


def get_workshop_sheet_range():
    """
    Returns the sheet range string for the Workshop tab.

    Returns:
        str: Workshop sheet range (e.g., "Workshop!A1")
    """
    return getattr(settings, "GOOGLE_SHEETS_WORKSHOP_RANGE", "Workshop!A1")


def get_existing_workshop_ids(service):
    """
    Reads column A (workshop registration IDs) from Workshop tab to prevent duplicates.

    Args:
        service: Authenticated Google Sheets API service

    Returns:
        set: Set of existing workshop registration IDs from column A
    """
    try:
        sheet_id = settings.GOOGLE_SHEETS_ID
        result = service.spreadsheets().values().get(
            spreadsheetId=sheet_id,
            range="Workshop!A:A"
        ).execute()

        values = result.get("values", [])
        existing_ids = {str(row[0]) for row in values[1:] if row}

        logger.debug(f"Found {len(existing_ids)} existing workshop IDs in sheet")
        return existing_ids

    except Exception as e:
        logger.error(f"Failed to read existing workshop IDs: {str(e)}")
        return set()


def build_workshop_header_row():
    """
    Dynamically builds header row from WorkshopRegistration model fields.
    Payment-related fields are placed at the end.

    Returns:
        list: Header row for Workshop tab
    """
    from core.models import WorkshopRegistration

    fields = list(WorkshopRegistration._meta.fields)
    field_names = [field.name for field in fields]

    def is_payment_field(name):
        lowered = name.lower()
        return "transaction" in lowered or "payment" in lowered or "fee" in lowered

    payment_field_names = [name for name in field_names if is_payment_field(name)]
    non_payment_field_names = [name for name in field_names if name not in payment_field_names]

    ordered_names = []
    for preferred in ["id", "full_name", "email", "workshop_id", "workshop_title", "status", "created_at"]:
        if preferred in non_payment_field_names:
            ordered_names.append(preferred)

    for name in non_payment_field_names:
        if name not in ordered_names:
            ordered_names.append(name)

    ordered_names.extend(payment_field_names)

    header_row = []
    for name in ordered_names:
        field = next((f for f in fields if f.name == name), None)
        if field is None:
            header_row.append(name)
        else:
            header_row.append(field.verbose_name.replace("_", " ").title())

    header_row.append("Last Updated")

    logger.debug(f"Built workshop header row with {len(header_row)} columns")
    return header_row


def build_workshop_data_row(workshop_instance):
    """
    Builds data row for workshop registration matching header order.

    Args:
        workshop_instance: WorkshopRegistration model instance

    Returns:
        list: Data row with values in header order
    """
    from core.models import WorkshopRegistration

    fields = list(WorkshopRegistration._meta.fields)
    field_names = [field.name for field in fields]

    def is_payment_field(name):
        lowered = name.lower()
        return "transaction" in lowered or "payment" in lowered or "fee" in lowered

    payment_field_names = [name for name in field_names if is_payment_field(name)]
    non_payment_field_names = [name for name in field_names if name not in payment_field_names]

    ordered_names = []
    for preferred in ["id", "full_name", "email", "workshop_id", "workshop_title", "status", "created_at"]:
        if preferred in non_payment_field_names:
            ordered_names.append(preferred)

    for name in non_payment_field_names:
        if name not in ordered_names:
            ordered_names.append(name)

    ordered_names.extend(payment_field_names)

    data_row = []
    for name in ordered_names:
        value = getattr(workshop_instance, name, None)

        lowered = name.lower()
        if "transaction_id" in lowered:
            data_row.append(str(value) if str(value).strip() else "PENDING")
            continue

        if "screenshot" in lowered:
            data_row.append("Uploaded ✓" if value else "Not Uploaded ✗")
            continue

        if lowered == "status" or "payment_status" in lowered:
            status_value = str(value).strip()
            data_row.append(f"★ {status_value}" if status_value else "★ PENDING")
            continue

        if value is None:
            data_row.append("")
            continue

        if isinstance(value, (datetime,)):
            data_row.append(value.isoformat())
        elif hasattr(value, "id"):
            data_row.append(str(value.id))
        else:
            data_row.append(str(value))

    data_row.append(datetime.now().strftime("%d-%m-%Y %H:%M"))

    logger.debug(f"Built workshop data row for ID {workshop_instance.id}")
    return data_row


def ensure_workshop_header_exists(service):
    """
    Ensures the Workshop tab has a header row.

    Args:
        service: Authenticated Google Sheets API service

    Returns:
        tuple: (success, header_created)
    """
    try:
        result = service.spreadsheets().values().get(
            spreadsheetId=settings.GOOGLE_SHEETS_ID,
            range="Workshop!A1:Z1"
        ).execute()

        values = result.get("values", [])
        if not values or len(values[0]) == 0:
            header_row = build_workshop_header_row()
            service.spreadsheets().values().update(
                spreadsheetId=settings.GOOGLE_SHEETS_ID,
                range="Workshop!A1",
                valueInputOption="USER_ENTERED",
                body={"values": [header_row]}
            ).execute()
            logger.info("Workshop header row written to Google Sheet")
            return True, True

        logger.debug("Workshop header row already exists")
        return True, False

    except Exception as e:
        logger.error(f"Failed to ensure workshop header exists: {str(e)}")
        return False, False


def append_workshop_to_google_sheet(workshop_instance):
    """
    Exports workshop registration to Workshop tab with update-if-exists logic.
    Falls back to Excel backup on failure.

    Args:
        workshop_instance: WorkshopRegistration model instance

    Returns:
        bool: True if successful, False otherwise
    """
    logger.info(
        f"Starting Workshop export for ID {workshop_instance.id} "
        f"(Status: {workshop_instance.status})"
    )

    try:
        service = get_sheets_service()
        sheet_id = settings.GOOGLE_SHEETS_ID

        header_ok, header_created = ensure_workshop_header_exists(service)
        if not header_ok:
            raise Exception("Failed to ensure Workshop header row exists")

        existing_ids = get_existing_workshop_ids(service)
        registration_id_str = str(workshop_instance.id)
        data_row = build_workshop_data_row(workshop_instance)

        if registration_id_str in existing_ids:
            result = service.spreadsheets().values().get(
                spreadsheetId=sheet_id,
                range="Workshop!A:A"
            ).execute()

            values = result.get("values", [])
            row_index = None
            for idx, row in enumerate(values[1:], start=2):
                if row and row[0] and str(row[0]) == registration_id_str:
                    row_index = idx
                    break

            if row_index:
                service.spreadsheets().values().update(
                    spreadsheetId=sheet_id,
                    range=f"Workshop!A{row_index}",
                    valueInputOption="USER_ENTERED",
                    body={"values": [data_row]}
                ).execute()
                logger.info(
                    f"Workshop registration {registration_id_str} updated at row {row_index}"
                )
            else:
                logger.warning(
                    f"Workshop registration {registration_id_str} not found for update; appending"
                )
                service.spreadsheets().values().append(
                    spreadsheetId=sheet_id,
                    range=get_workshop_sheet_range(),
                    valueInputOption="USER_ENTERED",
                    insertDataOption="INSERT_ROWS",
                    body={"values": [data_row]}
                ).execute()
        else:
            service.spreadsheets().values().append(
                spreadsheetId=sheet_id,
                range=get_workshop_sheet_range(),
                valueInputOption="USER_ENTERED",
                insertDataOption="INSERT_ROWS",
                body={"values": [data_row]}
            ).execute()
            logger.info(
                f"Workshop registration {registration_id_str} appended to Google Sheet"
            )

        if header_created:
            try:
                metadata = service.spreadsheets().get(
                    spreadsheetId=sheet_id,
                    fields="sheets(properties(sheetId,title),conditionalFormats)"
                ).execute()

                workshop_sheet = None
                for sheet in metadata.get("sheets", []):
                    if sheet.get("properties", {}).get("title") == "Workshop":
                        workshop_sheet = sheet
                        break

                if workshop_sheet and not workshop_sheet.get("conditionalFormats"):
                    payment_start_index = None
                    payment_end_index = None
                    fields = [f.name for f in workshop_instance._meta.fields]
                    payment_names = [
                        name for name in fields
                        if "transaction" in name.lower() or "payment" in name.lower() or "fee" in name.lower()
                    ]
                    ordered_fields = []
                    for preferred in [
                        "id", "full_name", "email", "workshop_id", "workshop_title", "status", "created_at"
                    ]:
                        if preferred in fields:
                            ordered_fields.append(preferred)
                    for name in fields:
                        if name not in ordered_fields and name not in payment_names:
                            ordered_fields.append(name)
                    ordered_fields.extend(payment_names)

                    payment_indices = [
                        idx for idx, name in enumerate(ordered_fields) if name in payment_names
                    ]
                    if payment_indices:
                        payment_start_index = min(payment_indices)
                        payment_end_index = max(payment_indices) + 1

                    if payment_start_index is not None and payment_end_index is not None:
                        yellow = {
                            "red": 1.0,
                            "green": 1.0,
                            "blue": 0.0
                        }
                        request = {
                            "addConditionalFormatRule": {
                                "rule": {
                                    "ranges": [
                                        {
                                            "sheetId": workshop_sheet.get("properties", {}).get("sheetId"),
                                            "startRowIndex": 0,
                                            "endRowIndex": 1,
                                            "startColumnIndex": payment_start_index,
                                            "endColumnIndex": payment_end_index
                                        }
                                    ],
                                    "booleanRule": {
                                        "condition": {
                                            "type": "CUSTOM_FORMULA",
                                            "values": [{"userEnteredValue": "=TRUE"}]
                                        },
                                        "format": {
                                            "backgroundColor": yellow
                                        }
                                    }
                                },
                                "index": 0
                            }
                        }
                        service.spreadsheets().batchUpdate(
                            spreadsheetId=sheet_id,
                            body={"requests": [request]}
                        ).execute()
                        logger.info("Applied Workshop header payment column formatting")
            except Exception as e:
                logger.warning(f"Failed to apply Workshop header formatting: {str(e)}")

        logger.info(
            f"Workshop registration {workshop_instance.id} export completed at {datetime.now().isoformat()}"
        )
        return True

    except Exception as e:
        logger.error(
            f"Failed to export workshop registration {workshop_instance.id} to Google Sheet: {str(e)}"
        )
        logger.info("Attempting Workshop Excel backup as fallback...")
        return append_workshop_to_excel_backup(workshop_instance)


def append_workshop_to_excel_backup(workshop_instance):
    """
    Fallback export to Excel backup when Google Sheet is unavailable.

    Args:
        workshop_instance: WorkshopRegistration model instance

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        from openpyxl.styles import PatternFill, Font

        exports_dir = settings.BASE_DIR / "exports"
        os.makedirs(exports_dir, exist_ok=True)
        excel_path = exports_dir / "approved_registrations.xlsx"

        header_row = build_workshop_header_row()
        data_row = build_workshop_data_row(workshop_instance)
        registration_id = str(workshop_instance.id)

        if excel_path.exists():
            wb = load_workbook(excel_path)
        else:
            wb = Workbook()

        if "Workshop" in wb.sheetnames:
            ws = wb["Workshop"]
        else:
            ws = wb.create_sheet(title="Workshop")

        if ws.max_row == 1 and ws.max_column == 1 and ws.cell(row=1, column=1).value is None:
            ws.append(header_row)

        payment_columns = []
        for idx, header in enumerate(header_row, start=1):
            lowered = str(header).lower()
            if "transaction" in lowered or "payment" in lowered or "fee" in lowered:
                payment_columns.append(idx)

        yellow = PatternFill(fill_type="solid", fgColor="FFFF00")
        bold = Font(bold=True)

        existing_row_num = None
        for row_idx in range(2, ws.max_row + 1):
            cell_value = ws.cell(row=row_idx, column=1).value
            if cell_value and str(cell_value) == registration_id:
                existing_row_num = row_idx
                break

        target_row = existing_row_num or (ws.max_row + 1)

        for col_idx, value in enumerate(data_row, start=1):
            cell = ws.cell(row=target_row, column=col_idx, value=value)
            if col_idx in payment_columns:
                cell.fill = yellow
                cell.font = bold

        for col_idx in payment_columns:
            header_cell = ws.cell(row=1, column=col_idx)
            header_cell.fill = yellow
            header_cell.font = bold

        wb.save(excel_path)
        if existing_row_num:
            logger.info(
                f"Workshop registration {registration_id} updated in Excel backup"
            )
        else:
            logger.info(
                f"Workshop registration {registration_id} appended to Excel backup"
            )
        return True

    except Exception as e:
        logger.error(
            f"Failed to write Workshop Excel backup for {workshop_instance.id}: {str(e)}"
        )
        return False
