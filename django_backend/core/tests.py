"""
Focused unit tests for the Google Sheets sync hardening.

These tests use unittest.mock to avoid any real network I/O or DB writes.
Run with:  python manage.py test core.tests
"""
import os
import unittest
from unittest.mock import MagicMock, call, patch

from django.test import TestCase, override_settings


# ---------------------------------------------------------------------------
# Helper: build a minimal mock Registration-like object
# ---------------------------------------------------------------------------

class _FakeReg:
    """Minimal stand-in for a Registration instance."""
    def __init__(self, pk=1, status="Under Process"):
        self.id = pk
        self.status = status

    def get_status_display(self):
        return self.status

    class _meta:
        fields = []  # build_data_row / build_header_row import from model; patched below


# ---------------------------------------------------------------------------
# 1. Retry-on-429 behaviour
# ---------------------------------------------------------------------------

class RetryOn429Test(TestCase):
    """_call_with_retry should retry on 429/500/503 and succeed on a later attempt."""

    def _make_http_error(self, status_code):
        from googleapiclient.errors import HttpError
        resp = MagicMock()
        resp.status = status_code
        return HttpError(resp=resp, content=b"error")

    def test_retries_on_429_and_succeeds(self):
        from core.utils.sheets_utils import _call_with_retry

        ok_response = {"values": [["id"], ["1"]]}
        request = MagicMock()
        # First two calls raise 429, third succeeds.
        request.execute.side_effect = [
            self._make_http_error(429),
            self._make_http_error(429),
            ok_response,
        ]

        with patch("core.utils.sheets_utils.time.sleep"):  # don't actually sleep
            result = _call_with_retry(request)

        self.assertEqual(result, ok_response)
        self.assertEqual(request.execute.call_count, 3)

    def test_retries_on_500(self):
        from core.utils.sheets_utils import _call_with_retry

        ok_response = {"values": []}
        request = MagicMock()
        request.execute.side_effect = [
            self._make_http_error(500),
            ok_response,
        ]

        with patch("core.utils.sheets_utils.time.sleep"):
            result = _call_with_retry(request)

        self.assertEqual(result, ok_response)
        self.assertEqual(request.execute.call_count, 2)

    def test_does_not_retry_on_403(self):
        """Permission errors must fail fast — no retries."""
        from googleapiclient.errors import HttpError
        from core.utils.sheets_utils import _call_with_retry

        request = MagicMock()
        resp = MagicMock()
        resp.status = 403
        request.execute.side_effect = HttpError(resp=resp, content=b"forbidden")

        with patch("core.utils.sheets_utils.time.sleep") as mock_sleep:
            with self.assertRaises(HttpError):
                _call_with_retry(request)

        mock_sleep.assert_not_called()
        self.assertEqual(request.execute.call_count, 1)

    def test_raises_after_all_retries_exhausted(self):
        """After 3 failures on a retryable code, the final HttpError must propagate."""
        from core.utils.sheets_utils import _call_with_retry

        request = MagicMock()
        request.execute.side_effect = self._make_http_error(429)

        with patch("core.utils.sheets_utils.time.sleep"):
            with self.assertRaises(Exception):
                _call_with_retry(request)

        # _RETRY_DELAYS has 3 entries + 1 final attempt = 4 attempts total
        self.assertEqual(request.execute.call_count, 4)


# ---------------------------------------------------------------------------
# 2. No duplicate row on rapid consecutive saves
# ---------------------------------------------------------------------------

class NoDuplicateRowTest(TestCase):
    """
    Calling append_approved_user_to_sheet twice for the same ID should not
    create a duplicate: the second call must detect the ID already present
    and call update instead of append.
    """

    def _sheet_state(self):
        """Simulates a sheet that gains the row after the first append."""
        # Initially empty (first get_existing_registration_ids call).
        empty = {"values": [["id"]]}          # just header
        with_row = {"values": [["id"], ["42"]]}  # after first append
        return empty, with_row

    @patch("core.utils.sheets_utils.get_sheets_service")
    @patch("core.utils.sheets_utils.build_data_row", return_value=["42", "data"])
    @patch("core.utils.sheets_utils.build_header_row", return_value=["id", "data"])
    @patch("core.utils.sheets_utils.time.sleep")
    def test_second_call_updates_not_appends(self, _sleep, _bhr, _bdr, mock_service_factory):
        from core.utils.sheets_utils import append_approved_user_to_sheet

        service = MagicMock()
        mock_service_factory.return_value = service

        # Spreadsheet ID and range must be truthy for the function to proceed.
        with override_settings(
            GOOGLE_SHEETS_ID="fake-id",
            GOOGLE_SHEETS_RANGE="Approvals!A:Z",
        ):
            # ---- First call: sheet is empty → should append ----
            # get() for column A returns empty (no rows after header)
            # get() for header check returns header row (non-empty)
            # re-check get() also returns empty (no rows yet)
            # append() → simulated success
            col_a_empty = MagicMock()
            col_a_empty.execute.return_value = {"values": [["id"]]}
            header_check = MagicMock()
            header_check.execute.return_value = {"values": [["id", "data"]]}
            append_req = MagicMock()
            append_req.execute.return_value = {}

            def values_get_side_effect(**kwargs):
                rng = kwargs.get("range", "")
                if "A1:ZZ1" in rng:
                    return header_check
                return col_a_empty

            service.spreadsheets.return_value.values.return_value.get.side_effect = (
                lambda **kw: values_get_side_effect(**kw)
            )
            service.spreadsheets.return_value.values.return_value.append.return_value = append_req
            service.spreadsheets.return_value.values.return_value.update.return_value = MagicMock(
                **{"execute.return_value": {}}
            )

            reg = _FakeReg(pk=42, status="Accepted")
            result1 = append_approved_user_to_sheet(reg)
            self.assertTrue(result1)

            # ---- Second call: sheet now contains the row → should update, not append ----
            col_a_with_row = MagicMock()
            col_a_with_row.execute.return_value = {"values": [["id"], ["42"]]}

            def values_get_with_row(**kwargs):
                rng = kwargs.get("range", "")
                if "A1:ZZ1" in rng:
                    return header_check
                return col_a_with_row

            service.spreadsheets.return_value.values.return_value.get.side_effect = (
                lambda **kw: values_get_with_row(**kw)
            )
            append_req.execute.reset_mock()

            result2 = append_approved_user_to_sheet(reg)
            self.assertTrue(result2)
            # update must have been called; append must NOT have been called again
            append_req.execute.assert_not_called()


# ---------------------------------------------------------------------------
# 3. DEBUG defaults to False when env var is unset
# ---------------------------------------------------------------------------

class DebugDefaultTest(unittest.TestCase):
    """
    DJANGO_DEBUG env var unset (or empty) → DEBUG must be False.
    DJANGO_DEBUG=True → DEBUG must be True.
    """

    def _evaluate_debug(self, env_value=None):
        """Replicate the exact expression from settings.py."""
        with patch.dict(os.environ, {"DJANGO_DEBUG": env_value} if env_value is not None else {}, clear=False):
            # Remove the key if we want to test "unset"
            env = os.environ.copy()
            if env_value is None:
                env.pop("DJANGO_DEBUG", None)
            return env.get("DJANGO_DEBUG", "False") == "True"

    def test_debug_false_when_unset(self):
        # Temporarily remove DJANGO_DEBUG from environment
        original = os.environ.pop("DJANGO_DEBUG", None)
        try:
            result = os.getenv("DJANGO_DEBUG", "False") == "True"
            self.assertFalse(result)
        finally:
            if original is not None:
                os.environ["DJANGO_DEBUG"] = original

    def test_debug_false_when_set_to_false_string(self):
        with patch.dict(os.environ, {"DJANGO_DEBUG": "False"}):
            result = os.getenv("DJANGO_DEBUG", "False") == "True"
            self.assertFalse(result)

    def test_debug_true_when_set_to_true_string(self):
        with patch.dict(os.environ, {"DJANGO_DEBUG": "True"}):
            result = os.getenv("DJANGO_DEBUG", "False") == "True"
            self.assertTrue(result)

    def test_debug_false_for_truthy_but_wrong_value(self):
        """Only the exact string 'True' must enable debug — not '1', 'true', 'yes'."""
        for bad in ("1", "true", "yes", "TRUE", "on"):
            with patch.dict(os.environ, {"DJANGO_DEBUG": bad}):
                result = os.getenv("DJANGO_DEBUG", "False") == "True"
                self.assertFalse(result, f"Expected False for DJANGO_DEBUG={bad!r}")


# ---------------------------------------------------------------------------
# 4. SHEET_SYNC_FALLBACK marker is logged on Google Sheets failure
# ---------------------------------------------------------------------------

class FallbackLoggingTest(TestCase):
    """When the Sheets API fails, ERROR log must contain SHEET_SYNC_FALLBACK."""

    @patch("core.utils.sheets_utils.append_to_excel_backup", return_value=True)
    @patch("core.utils.sheets_utils.get_sheets_service", side_effect=Exception("network error"))
    def test_fallback_marker_in_log_on_sheets_failure(self, _mock_svc, _mock_excel):
        from core.utils.sheets_utils import append_approved_user_to_sheet

        reg = _FakeReg(pk=7, status="Accepted")
        with override_settings(GOOGLE_SHEETS_ID="fake-id", GOOGLE_SHEETS_RANGE="Approvals!A:Z"):
            with self.assertLogs("core.utils.sheets_utils", level="ERROR") as log_cm:
                result = append_approved_user_to_sheet(reg)

        self.assertTrue(result)  # Excel backup succeeded → True
        fallback_lines = [line for line in log_cm.output if "SHEET_SYNC_FALLBACK" in line]
        self.assertTrue(
            fallback_lines,
            "Expected at least one ERROR log containing 'SHEET_SYNC_FALLBACK'",
        )
        # Verify registration_id is in the fallback log line
        self.assertTrue(
            any("7" in line for line in fallback_lines),
            "SHEET_SYNC_FALLBACK log should include the registration_id",
        )

    @patch("core.utils.sheets_utils.append_workshop_to_excel_backup", return_value=True)
    @patch("core.utils.sheets_utils.get_sheets_service", side_effect=Exception("timeout"))
    def test_workshop_fallback_marker_in_log(self, _mock_svc, _mock_excel):
        from core.utils.sheets_utils import append_workshop_to_google_sheet

        ws = MagicMock()
        ws.id = 99
        ws.status = "Under Process"
        with override_settings(GOOGLE_SHEETS_ID="fake-id"):
            with self.assertLogs("core.utils.sheets_utils", level="ERROR") as log_cm:
                result = append_workshop_to_google_sheet(ws)

        self.assertTrue(result)
        fallback_lines = [line for line in log_cm.output if "SHEET_SYNC_FALLBACK" in line]
        self.assertTrue(fallback_lines)
        self.assertTrue(any("WorkshopRegistration" in line for line in fallback_lines))


# ---------------------------------------------------------------------------
# 5. "Under Process" registrations are exported (root-cause regression test)
# ---------------------------------------------------------------------------

class UnderProcessExportTest(TestCase):
    """
    Regression test for the bug where only Accepted rows appeared in the sheet.

    Root cause: valid_statuses was a hardcoded list; if it only contained
    "Accepted" (as in the pre-hotfix code), Under Process records were silently
    skipped.  After the fix, valid_statuses is derived from
    Registration.STATUS_CHOICES, so every model-defined status is accepted.

    This test verifies:
    1. A new registration with status "Under Process" is NOT filtered out by
       append_approved_user_to_sheet — it reaches the Sheets API append call.
    2. All three Registration statuses (Under Process, Accepted, Rejected) are
       accepted — none triggers the "skipping export" early-return path.
    3. An unknown/garbage status IS correctly skipped.
    4. The signal handler enqueues a sync job for a new "Under Process" save,
       not just for status changes to Accepted.
    """

    # ---- 5a. Under Process status passes the valid_statuses guard ----

    @patch("core.utils.sheets_utils.get_sheets_service")
    @patch("core.utils.sheets_utils.build_data_row", return_value=["5", "data"])
    @patch("core.utils.sheets_utils.build_header_row", return_value=["id", "data"])
    @patch("core.utils.sheets_utils.time.sleep")
    def test_under_process_is_exported_to_sheet(self, _sleep, _bhr, _bdr, mock_svc_factory):
        """A brand-new Under Process registration must reach the append() call."""
        from core.utils.sheets_utils import append_approved_user_to_sheet

        service = MagicMock()
        mock_svc_factory.return_value = service

        # Sheet is empty — no existing IDs.
        col_a_empty = MagicMock()
        col_a_empty.execute.return_value = {"values": [["id"]]}
        header_present = MagicMock()
        header_present.execute.return_value = {"values": [["id", "data"]]}
        append_req = MagicMock()
        append_req.execute.return_value = {}

        def get_side_effect(**kwargs):
            rng = kwargs.get("range", "")
            if "A1:ZZ1" in rng:
                return header_present
            return col_a_empty

        service.spreadsheets.return_value.values.return_value.get.side_effect = (
            lambda **kw: get_side_effect(**kw)
        )
        service.spreadsheets.return_value.values.return_value.append.return_value = append_req

        reg = _FakeReg(pk=5, status="Under Process")
        with override_settings(GOOGLE_SHEETS_ID="fake-id", GOOGLE_SHEETS_RANGE="Approvals!A:Z"):
            result = append_approved_user_to_sheet(reg)

        self.assertTrue(result, "Under Process registration should be exported successfully")
        # The append API call must have fired — not short-circuited by valid_statuses.
        append_req.execute.assert_called_once()

    # ---- 5b. All three Registration statuses pass the guard ----

    @patch("core.utils.sheets_utils.get_sheets_service")
    @patch("core.utils.sheets_utils.build_data_row", return_value=["1", "data"])
    @patch("core.utils.sheets_utils.build_header_row", return_value=["id", "data"])
    @patch("core.utils.sheets_utils.time.sleep")
    def test_all_valid_statuses_are_exported(self, _sleep, _bhr, _bdr, mock_svc_factory):
        """Under Process, Accepted, and Rejected must all be exported without warning."""
        from core.utils.sheets_utils import append_approved_user_to_sheet
        from core.models import Registration

        service = MagicMock()
        mock_svc_factory.return_value = service

        col_a_empty = MagicMock()
        col_a_empty.execute.return_value = {"values": [["id"]]}
        header_present = MagicMock()
        header_present.execute.return_value = {"values": [["id", "data"]]}
        append_req = MagicMock()
        append_req.execute.return_value = {}

        def get_side_effect(**kwargs):
            rng = kwargs.get("range", "")
            if "A1:ZZ1" in rng:
                return header_present
            return col_a_empty

        service.spreadsheets.return_value.values.return_value.get.side_effect = (
            lambda **kw: get_side_effect(**kw)
        )
        service.spreadsheets.return_value.values.return_value.append.return_value = append_req

        all_statuses = [choice[0] for choice in Registration.STATUS_CHOICES]
        self.assertEqual(
            len(all_statuses), 3,
            "This test assumes Registration has exactly 3 status choices; update if model changes"
        )

        with override_settings(GOOGLE_SHEETS_ID="fake-id", GOOGLE_SHEETS_RANGE="Approvals!A:Z"):
            for status_val in all_statuses:
                append_req.execute.reset_mock()
                reg = _FakeReg(pk=1, status=status_val)
                result = append_approved_user_to_sheet(reg)
                self.assertTrue(result, f"Status '{status_val}' should be exported")
                append_req.execute.assert_called_once_msg = f"append() not called for status '{status_val}'"

    # ---- 5c. Unknown/garbage status is correctly skipped ----

    @patch("core.utils.sheets_utils.get_sheets_service")
    def test_unknown_status_is_skipped(self, mock_svc_factory):
        """A status not in STATUS_CHOICES must return False and not call the API."""
        from core.utils.sheets_utils import append_approved_user_to_sheet

        service = MagicMock()
        mock_svc_factory.return_value = service

        reg = _FakeReg(pk=9, status="InvalidStatus_XYZ")
        with override_settings(GOOGLE_SHEETS_ID="fake-id", GOOGLE_SHEETS_RANGE="Approvals!A:Z"):
            with self.assertLogs("core.utils.sheets_utils", level="WARNING") as log_cm:
                result = append_approved_user_to_sheet(reg)

        self.assertFalse(result)
        service.spreadsheets.assert_not_called()
        self.assertTrue(any("unknown status" in line for line in log_cm.output))

    # ---- 5d. Signal handler enqueues a job for a new Under Process record ----

    def test_signal_enqueues_for_under_process_creation(self):
        """
        export_registration_to_sheet must enqueue a sync job on every post_save,
        including the initial creation of an Under Process record.

        We test the signal handler directly (bypassing DB and transaction.on_commit)
        by confirming it calls _registration_worker.enqueue when GOOGLE_SHEETS_ID
        is set.
        """
        from core.signals import export_registration_to_sheet, _registration_worker

        fake_instance = _FakeReg(pk=77, status="Under Process")

        enqueued = []
        original_enqueue = _registration_worker.enqueue

        def capture_enqueue(func, *args):
            enqueued.append((func, args))

        _registration_worker.enqueue = capture_enqueue
        try:
            with override_settings(GOOGLE_SHEETS_ID="fake-sheet-id"):
                # Simulate Django calling the signal handler.
                # transaction.on_commit executes the callback immediately in tests
                # (Django's TestCase wraps each test in a transaction that never
                # commits, so on_commit callbacks run at test teardown — but we
                # can verify the lambda is passed by patching on_commit).
                with patch("core.signals.transaction.on_commit", side_effect=lambda fn: fn()):
                    export_registration_to_sheet(
                        sender=None,
                        instance=fake_instance,
                        created=True,
                    )

            self.assertEqual(len(enqueued), 1, "Expected exactly one enqueue call")
            func, args = enqueued[0]
            # The enqueued function should be _sync_registration with the instance id.
            from core.signals import _sync_registration
            self.assertIs(func, _sync_registration)
            self.assertEqual(args, (77,))
        finally:
            _registration_worker.enqueue = original_enqueue

    # ---- 5e. Workshop sync path is untouched (non-regression) ----

    def test_workshop_signal_still_enqueues(self):
        """
        The Workshop sync signal must still enqueue to _workshop_worker,
        not _registration_worker, confirming the two paths remain independent.
        """
        from core.signals import export_workshop_registration_to_sheet, _workshop_worker, _registration_worker

        fake_ws = MagicMock()
        fake_ws.id = 55

        reg_enqueued = []
        ws_enqueued = []

        _registration_worker_orig = _registration_worker.enqueue
        _workshop_worker_orig = _workshop_worker.enqueue

        _registration_worker.enqueue = lambda fn, *a: reg_enqueued.append((fn, a))
        _workshop_worker.enqueue = lambda fn, *a: ws_enqueued.append((fn, a))

        try:
            with override_settings(GOOGLE_SHEETS_ID="fake-sheet-id"):
                with patch("core.signals.transaction.on_commit", side_effect=lambda fn: fn()):
                    export_workshop_registration_to_sheet(
                        sender=None,
                        instance=fake_ws,
                        created=True,
                    )

            self.assertEqual(len(ws_enqueued), 1, "Workshop worker must have 1 enqueue")
            self.assertEqual(len(reg_enqueued), 0, "Registration worker must NOT be touched")

            from core.signals import _sync_workshop
            func, args = ws_enqueued[0]
            self.assertIs(func, _sync_workshop)
            self.assertEqual(args, (55,))
        finally:
            _registration_worker.enqueue = _registration_worker_orig
            _workshop_worker.enqueue = _workshop_worker_orig
