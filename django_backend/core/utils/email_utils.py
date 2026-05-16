import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

logger = logging.getLogger("core.utils.email_utils")


def send_email_safe(subject, to_email, template_html, template_txt, context):
    """
    Base safe email sender.
    Wraps all sends in try/except.
    Email failure must NEVER crash any existing workflow.
    Logs all failures with full error detail.
    Returns True on success, False on failure.
    """
    if not to_email:
        logger.error("Email send failed: missing recipient for subject '%s'", subject)
        return False

    try:
        text_body = render_to_string(template_txt, context)
        html_body = render_to_string(template_html, context)
        message = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@conference.com"),
            to=[to_email],
        )
        message.attach_alternative(html_body, "text/html")
        message.send(fail_silently=False)
        return True
    except Exception:
        logger.exception("Email send failed to %s for subject '%s'", to_email, subject)
        return False


# WORKSHOP EMAILS

def send_workshop_registration_email(workshop_registration):
    """
    Email 1: Sent when user successfully registers for workshop.
    Contains: workshop ID, workshop name, date, venue,
    user name, registration details.
    Subject: "Workshop Registration Confirmed - Your Workshop ID"
    """
    subject = "Workshop Registration Confirmed - Your Workshop ID"
    participant_type = (
        workshop_registration.get_participant_type_display()
        if hasattr(workshop_registration, "get_participant_type_display")
        else str(workshop_registration.participant_type)
    )

    context = {
        "conference_name": getattr(settings, "CONFERENCE_NAME", "Conference"),
        "logo_url": getattr(settings, "CONFERENCE_LOGO_URL", ""),
        "footer_text": getattr(settings, "CONFERENCE_EMAIL_FOOTER", ""),
        "recipient_name": workshop_registration.full_name,
        "workshop_reference": workshop_registration.registration_reference,
        "workshop_title": workshop_registration.workshop_title,
        "workshop_date": getattr(settings, "WORKSHOP_DATE", "To be announced"),
        "workshop_venue": getattr(settings, "WORKSHOP_VENUE", "To be announced"),
        "participant_type": participant_type,
        "fee_amount": str(workshop_registration.fee_amount),
        "institution": workshop_registration.institution,
        "designation": workshop_registration.designation or "",
        "email": workshop_registration.email,
        "phone": workshop_registration.phone,
    }

    return send_email_safe(
        subject=subject,
        to_email=workshop_registration.email,
        template_html="core/emails/workshop_registration_confirmation.html",
        template_txt="core/emails/workshop_registration_confirmation.txt",
        context=context,
    )


def send_workshop_payment_reminder_email(workshop_registration):
    """
    Email 2: Sent when payment is pending/due.
    Triggered based on state transition found in Phase 0 analysis.
    Contains: amount due, payment instructions, deadline,
    workshop ID for reference, bank/UPI details if in model.
    Subject: "Payment Due - Workshop Registration"
    """
    subject = "Payment Due - Workshop Registration"

    context = {
        "conference_name": getattr(settings, "CONFERENCE_NAME", "Conference"),
        "logo_url": getattr(settings, "CONFERENCE_LOGO_URL", ""),
        "footer_text": getattr(settings, "CONFERENCE_EMAIL_FOOTER", ""),
        "recipient_name": workshop_registration.full_name,
        "workshop_reference": workshop_registration.registration_reference,
        "workshop_title": workshop_registration.workshop_title,
        "amount_due": str(workshop_registration.fee_amount),
        "payment_deadline": getattr(settings, "WORKSHOP_PAYMENT_DEADLINE", "To be announced"),
        "payment_instructions": getattr(settings, "WORKSHOP_PAYMENT_INSTRUCTIONS", "To be shared"),
        "bank_details": getattr(settings, "WORKSHOP_BANK_DETAILS", "To be shared"),
        "upi_details": getattr(settings, "WORKSHOP_UPI_DETAILS", "To be shared"),
    }

    return send_email_safe(
        subject=subject,
        to_email=workshop_registration.email,
        template_html="core/emails/workshop_payment_reminder.html",
        template_txt="core/emails/workshop_payment_reminder.txt",
        context=context,
    )


def send_workshop_payment_confirmation_email(workshop_registration):
    """
    Email 3: Sent when payment is verified/confirmed.
    Contains: payment confirmation, workshop ID, final
    registration details, what to bring, venue details.
    Subject: "Payment Confirmed - Workshop Registration Complete"
    """
    subject = "Payment Confirmed - Workshop Registration Complete"

    context = {
        "conference_name": getattr(settings, "CONFERENCE_NAME", "Conference"),
        "logo_url": getattr(settings, "CONFERENCE_LOGO_URL", ""),
        "footer_text": getattr(settings, "CONFERENCE_EMAIL_FOOTER", ""),
        "recipient_name": workshop_registration.full_name,
        "workshop_reference": workshop_registration.registration_reference,
        "workshop_title": workshop_registration.workshop_title,
        "workshop_date": getattr(settings, "WORKSHOP_DATE", "To be announced"),
        "workshop_venue": getattr(settings, "WORKSHOP_VENUE", "To be announced"),
        "what_to_bring": getattr(settings, "WORKSHOP_WHAT_TO_BRING", "To be announced"),
        "arrival_time": getattr(settings, "WORKSHOP_ARRIVAL_TIME", "To be announced"),
    }

    return send_email_safe(
        subject=subject,
        to_email=workshop_registration.email,
        template_html="core/emails/workshop_payment_confirmed.html",
        template_txt="core/emails/workshop_payment_confirmed.txt",
        context=context,
    )


# CONFERENCE REGISTRATION EMAILS

def send_conference_approval_email(registration):
    """
    Sent when registration status -> approved.
    Checks if user is presenting a paper.
    """
    is_presenter = bool(getattr(registration, "is_presenter", False))

    if is_presenter:
        subject = "Registration Approved - Paper Presentation Details"
        template_html = "core/emails/conference_registration_approved_with_paper.html"
        template_txt = "core/emails/conference_registration_approved_with_paper.txt"
    else:
        subject = "Registration Approved - Welcome to the Conference"
        template_html = "core/emails/conference_registration_approved.html"
        template_txt = "core/emails/conference_registration_approved.txt"

    presentation_type = ""
    if hasattr(registration, "get_presentation_type_display"):
        presentation_type = registration.get_presentation_type_display() or ""

    context = {
        "conference_name": getattr(settings, "CONFERENCE_NAME", "Conference"),
        "logo_url": getattr(settings, "CONFERENCE_LOGO_URL", ""),
        "footer_text": getattr(settings, "CONFERENCE_EMAIL_FOOTER", ""),
        "recipient_name": registration.full_name,
        "registration_id": str(registration.id),
        "conference_dates": getattr(settings, "CONFERENCE_DATES", "To be announced"),
        "conference_venue": getattr(settings, "CONFERENCE_VENUE", "To be announced"),
        "schedule_link": getattr(settings, "CONFERENCE_SCHEDULE_LINK", "To be announced"),
        "paper_title": getattr(registration, "abstract_title", "") or "",
        "paper_id": getattr(registration, "abstract_id", "") or "",
        "cmt_id": getattr(registration, "cmt_id", "") or "",
        "presentation_type": presentation_type,
        "presentation_schedule": getattr(settings, "CONFERENCE_PRESENTATION_SCHEDULE", "To be announced"),
        "important_dates": getattr(settings, "CONFERENCE_IMPORTANT_DATES", "To be announced"),
    }

    return send_email_safe(
        subject=subject,
        to_email=registration.email,
        template_html=template_html,
        template_txt=template_txt,
        context=context,
    )


def send_conference_submission_email(registration):
    """
    Sent when a registration is submitted and status is Under Process.
    Contains payment details and transaction info.
    """
    subject = "Registration Received - Payment Under Review"
    context = {
        "conference_name": getattr(settings, "CONFERENCE_NAME", "Conference"),
        "logo_url": getattr(settings, "CONFERENCE_LOGO_URL", ""),
        "footer_text": getattr(settings, "CONFERENCE_EMAIL_FOOTER", ""),
        "recipient_name": registration.full_name,
        "registration_id": str(registration.id),
        "email": registration.email,
        "payment_amount": str(getattr(registration, "payment_amount", "")),
        "transaction_id": getattr(registration, "transaction_id", "") or "Not available",
    }

    return send_email_safe(
        subject=subject,
        to_email=registration.email,
        template_html="core/emails/conference_registration_submitted.html",
        template_txt="core/emails/conference_registration_submitted.txt",
        context=context,
    )


def send_conference_rejection_email(registration):
    """
    Sent when registration status -> rejected.
    Contains: polite rejection message, reason if available,
    contact information for queries.
    Subject: "Conference Registration Update"
    """
    subject = "Conference Registration Update"

    context = {
        "conference_name": getattr(settings, "CONFERENCE_NAME", "Conference"),
        "logo_url": getattr(settings, "CONFERENCE_LOGO_URL", ""),
        "footer_text": getattr(settings, "CONFERENCE_EMAIL_FOOTER", ""),
        "recipient_name": registration.full_name,
        "rejection_reason": getattr(registration, "admin_notes", "") or "Not specified.",
        "contact_email": getattr(settings, "CONFERENCE_CONTACT_EMAIL", "contact@conference.com"),
    }

    return send_email_safe(
        subject=subject,
        to_email=registration.email,
        template_html="core/emails/conference_registration_rejected.html",
        template_txt="core/emails/conference_registration_rejected.txt",
        context=context,
    )
