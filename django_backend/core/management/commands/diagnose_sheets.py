# core/management/commands/diagnose_sheets.py
"""
Diagnostic command: makes raw Google Sheets API calls with NO exception swallowing.
Every error is printed in full to stdout so the root cause of sheet sync failures
can be identified without reading log files.

Run on the production server:
    python3 manage.py diagnose_sheets

This command is READ-ONLY for the first 5 steps.
Step 6 does one live append of a sentinel row (then immediately deletes it).
Pass --no-write to skip step 6 if you want fully read-only mode.
"""
import traceback
from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Diagnose Google Sheets connectivity and permission issues. Prints full exceptions."

    def add_arguments(self, parser):
        parser.add_argument(
            "--no-write",
            action="store_true",
            dest="no_write",
            help="Skip the live append test (step 6). Fully read-only mode.",
        )

    def handle(self, *args, **options):
        no_write = options.get("no_write", False)

        sheet_id = getattr(settings, "GOOGLE_SHEETS_ID", "")
        range_name = getattr(settings, "GOOGLE_SHEETS_RANGE", "")
        tab_name = range_name.split("!")[0] if range_name else ""
        creds_path = str(getattr(settings, "GOOGLE_SHEETS_CREDENTIALS_JSON", ""))

        self.stdout.write("=" * 70)
        self.stdout.write("GOOGLE SHEETS DIAGNOSTIC")
        self.stdout.write("=" * 70)
        self.stdout.write(f"  GOOGLE_SHEETS_ID    : {sheet_id!r}")
        self.stdout.write(f"  GOOGLE_SHEETS_RANGE : {range_name!r}")
        self.stdout.write(f"  Tab name extracted  : {tab_name!r}")
        self.stdout.write(f"  Credentials path    : {creds_path!r}")
        self.stdout.write("")

        # ------------------------------------------------------------------
        # STEP 1: credentials file exists
        # ------------------------------------------------------------------
        self.stdout.write("STEP 1: Check credentials file exists on disk...")
        import os
        if os.path.exists(creds_path):
            self.stdout.write(self.style.SUCCESS(f"  [OK] Credentials file found at {creds_path}"))
        else:
            self.stdout.write(self.style.ERROR(f"  [FAIL] Credentials file NOT found at {creds_path}"))
            self.stdout.write("  Cannot proceed without credentials. Stopping.")
            return
        self.stdout.write("")

        # ------------------------------------------------------------------
        # STEP 2: authenticate — full exception on failure
        # ------------------------------------------------------------------
        self.stdout.write("STEP 2: Authenticate with Google Sheets API...")
        service = None
        try:
            from google.oauth2.service_account import Credentials
            from googleapiclient import discovery
            credentials = Credentials.from_service_account_file(
                creds_path,
                scopes=["https://www.googleapis.com/auth/spreadsheets"]
            )
            service = discovery.build("sheets", "v4", credentials=credentials)
            self.stdout.write(self.style.SUCCESS("  [OK] Authentication succeeded"))
        except Exception:
            self.stdout.write(self.style.ERROR("  [FAIL] Authentication failed:"))
            self.stdout.write(traceback.format_exc())
            return
        self.stdout.write("")

        # ------------------------------------------------------------------
        # STEP 3: list all tabs in the spreadsheet
        # ------------------------------------------------------------------
        self.stdout.write("STEP 3: List all tabs in the spreadsheet...")
        try:
            metadata = service.spreadsheets().get(
                spreadsheetId=sheet_id,
                fields="sheets(properties(sheetId,title))",
            ).execute()
            sheets = metadata.get("sheets", [])
            self.stdout.write(f"  Found {len(sheets)} tab(s):")
            found_tab = False
            for s in sheets:
                props = s.get("properties", {})
                title = props.get("title", "?")
                sid = props.get("sheetId", "?")
                marker = " ← THIS IS WHERE BACKFILL WRITES" if title == tab_name else ""
                self.stdout.write(f"    sheetId={sid}  title={title!r}{marker}")
                if title == tab_name:
                    found_tab = True
            if not found_tab:
                self.stdout.write(
                    self.style.ERROR(
                        f"\n  [CRITICAL] Tab {tab_name!r} does NOT exist in this spreadsheet!\n"
                        f"  GOOGLE_SHEETS_RANGE={range_name!r} refers to a tab that doesn't exist.\n"
                        f"  The append() API call creates a NEW hidden sheet or fails silently.\n"
                        f"  Fix: update GOOGLE_SHEETS_RANGE in .env to use one of the tab names above."
                    )
                )
            else:
                self.stdout.write(self.style.SUCCESS(f"\n  [OK] Tab {tab_name!r} exists in the spreadsheet"))
        except Exception:
            self.stdout.write(self.style.ERROR("  [FAIL] spreadsheets().get() failed:"))
            self.stdout.write(traceback.format_exc())
            return
        self.stdout.write("")

        # ------------------------------------------------------------------
        # STEP 4: read column A of the target tab — count rows
        # ------------------------------------------------------------------
        self.stdout.write(f"STEP 4: Read column A of tab {tab_name!r}...")
        try:
            result = service.spreadsheets().values().get(
                spreadsheetId=sheet_id,
                range=f"{tab_name}!A:A",
            ).execute()
            values = result.get("values", [])
            self.stdout.write(f"  Rows returned (including header): {len(values)}")
            if values:
                self.stdout.write(f"  Row 1 (header/first cell): {values[0]}")
            if len(values) > 1:
                self.stdout.write(f"  Row 2 (first data cell):   {values[1]}")
                self.stdout.write(f"  Last row:                  {values[-1]}")
            data_rows = len(values) - 1 if len(values) > 1 else 0
            self.stdout.write(self.style.SUCCESS(f"  [OK] Tab has {data_rows} data row(s) (excluding header)"))
        except Exception:
            self.stdout.write(self.style.ERROR(f"  [FAIL] values().get() on tab {tab_name!r} failed:"))
            self.stdout.write(traceback.format_exc())
            self.stdout.write(
                self.style.ERROR(
                    "  This is the error that causes the Excel fallback. "
                    "If this is a 404, the tab name in GOOGLE_SHEETS_RANGE does not match any real tab."
                )
            )
            return
        self.stdout.write("")

        # ------------------------------------------------------------------
        # STEP 5: read the header row — confirm it contains 'payment_date'
        # ------------------------------------------------------------------
        self.stdout.write(f"STEP 5: Read header row of tab {tab_name!r}...")
        try:
            result = service.spreadsheets().values().get(
                spreadsheetId=sheet_id,
                range=f"{tab_name}!1:1",
            ).execute()
            header = result.get("values", [[]])[0] if result.get("values") else []
            self.stdout.write(f"  Header columns ({len(header)} total): {header[:10]}{'...' if len(header) > 10 else ''}")
            if "payment_date" in header:
                idx = header.index("payment_date")
                self.stdout.write(self.style.SUCCESS(f"  [OK] 'payment_date' found at column index {idx} (0-based)"))
            else:
                self.stdout.write(
                    self.style.WARNING(
                        "  [WARN] 'payment_date' not found in header row. "
                        "--sort will fail until a backfill writes the header."
                    )
                )
        except Exception:
            self.stdout.write(self.style.ERROR("  [FAIL] Reading header row failed:"))
            self.stdout.write(traceback.format_exc())
        self.stdout.write("")

        # ------------------------------------------------------------------
        # STEP 6: live append test — write a sentinel row, confirm it appears,
        # then delete it. This is the only way to confirm append() actually works.
        # ------------------------------------------------------------------
        if no_write:
            self.stdout.write("STEP 6: Skipped (--no-write passed).")
            self.stdout.write("")
        else:
            self.stdout.write(f"STEP 6: Live append test on tab {tab_name!r}...")
            self.stdout.write("  Writing sentinel row '__DIAGNOSTIC_TEST__'...")
            sentinel_row = ["__DIAGNOSTIC_TEST__", "diagnostic", "test"]
            appended_range = None
            try:
                result = service.spreadsheets().values().append(
                    spreadsheetId=sheet_id,
                    range=range_name,
                    valueInputOption="USER_ENTERED",
                    body={"values": [sentinel_row]},
                ).execute()
                appended_range = result.get("updates", {}).get("updatedRange", "unknown")
                self.stdout.write(self.style.SUCCESS(
                    f"  [OK] Append succeeded. Row written to: {appended_range!r}"
                ))

                # Verify the sentinel actually appears where expected.
                if tab_name in (appended_range or ""):
                    self.stdout.write(self.style.SUCCESS(
                        f"  [OK] Confirmed: data landed in tab {tab_name!r} as expected"
                    ))
                else:
                    self.stdout.write(self.style.ERROR(
                        f"  [CRITICAL] Data was written to {appended_range!r} — "
                        f"NOT to tab {tab_name!r}! "
                        "This confirms the tab name in GOOGLE_SHEETS_RANGE does not match "
                        "the actual tab where data is landing."
                    ))

            except Exception:
                self.stdout.write(self.style.ERROR("  [FAIL] Append failed with full exception:"))
                self.stdout.write(traceback.format_exc())
                self.stdout.write(
                    self.style.ERROR(
                        "  This is the EXACT error that causes the Excel fallback on every write.\n"
                        "  Fix this error and the backfill will work."
                    )
                )
                appended_range = None

            # Clean up: delete the sentinel row
            if appended_range and "__DIAGNOSTIC_TEST__" not in appended_range:
                appended_range = None  # safety: don't delete if range looks wrong

            if appended_range:
                self.stdout.write("  Cleaning up sentinel row...")
                try:
                    # Re-read column A to find the sentinel row index.
                    col_a = service.spreadsheets().values().get(
                        spreadsheetId=sheet_id,
                        range=f"{tab_name}!A:A",
                    ).execute()
                    col_a_vals = col_a.get("values", [])
                    sentinel_row_idx = None
                    for i, row in enumerate(col_a_vals):
                        if row and row[0] == "__DIAGNOSTIC_TEST__":
                            sentinel_row_idx = i + 1  # 1-based
                            break

                    if sentinel_row_idx:
                        # Delete the row using batchUpdate deleteRange
                        metadata2 = service.spreadsheets().get(
                            spreadsheetId=sheet_id,
                            fields="sheets(properties(sheetId,title))",
                        ).execute()
                        numeric_sid = None
                        for s in metadata2.get("sheets", []):
                            if s["properties"]["title"] == tab_name:
                                numeric_sid = s["properties"]["sheetId"]
                                break

                        if numeric_sid is not None:
                            service.spreadsheets().batchUpdate(
                                spreadsheetId=sheet_id,
                                body={"requests": [{
                                    "deleteDimension": {
                                        "range": {
                                            "sheetId": numeric_sid,
                                            "dimension": "ROWS",
                                            "startIndex": sentinel_row_idx - 1,
                                            "endIndex": sentinel_row_idx,
                                        }
                                    }
                                }]},
                            ).execute()
                            self.stdout.write(self.style.SUCCESS(
                                f"  [OK] Sentinel row deleted from row {sentinel_row_idx}"
                            ))
                        else:
                            self.stdout.write(self.style.WARNING(
                                "  [WARN] Could not find numeric sheetId to delete sentinel row. "
                                "Delete it manually from the sheet."
                            ))
                    else:
                        self.stdout.write(self.style.WARNING(
                            "  [WARN] Sentinel row not found for cleanup — may have landed "
                            "in a different tab. Check the sheet manually."
                        ))
                except Exception:
                    self.stdout.write(self.style.WARNING(
                        "  [WARN] Cleanup failed. Delete the '__DIAGNOSTIC_TEST__' row manually."
                    ))
                    self.stdout.write(traceback.format_exc())
            self.stdout.write("")

        # ------------------------------------------------------------------
        # Summary
        # ------------------------------------------------------------------
        self.stdout.write("=" * 70)
        self.stdout.write("DIAGNOSTIC COMPLETE")
        self.stdout.write(
            "If all steps above show [OK], the sheets integration is healthy.\n"
            "If any step shows [FAIL] or [CRITICAL], that is the root cause of\n"
            "the Excel fallback — fix it before running the backfill again."
        )
        self.stdout.write("=" * 70)
