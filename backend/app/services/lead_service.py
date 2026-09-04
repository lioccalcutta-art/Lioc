from sqlalchemy.orm import Session
from backend.app.repositories.leads_repo import LeadsRepository
from backend.app.services.email_service import email_service
from backend.app.schemas.leads import (
    QuoteCreate,
    SampleCreate,
    DistributorCreate,
    ContactCreate,
    LeadSubmissionResponse,
)


class LeadService:
    def __init__(self, db: Session):
        self.repo = LeadsRepository(db)

    def submit_quote(self, quote_in: QuoteCreate) -> LeadSubmissionResponse:
        quote = self.repo.create_quote(quote_in)
        # Dispatch notification to internal sales desk & confirmation to customer
        email_service.send_quote_notification(quote)
        email_service.send_quote_customer_confirmation(quote)
        return LeadSubmissionResponse(
            success=True,
            message="Your quotation request has been submitted successfully. A confirmation email with your reference ID has been sent to your email address, and our commercial sales team will connect with you shortly.",
            reference_id=quote.reference_id,
        )

    def submit_sample(self, sample_in: SampleCreate) -> LeadSubmissionResponse:
        sample = self.repo.create_sample(sample_in)
        # Dispatch notification to dispatch desk & confirmation to customer
        email_service.send_sample_notification(sample)
        email_service.send_sample_customer_confirmation(sample)
        return LeadSubmissionResponse(
            success=True,
            message="Your sample request has been received. A confirmation email with your tracking reference ID has been sent, and our team will review your business details and reach out shortly.",
            reference_id=sample.reference_id,
        )

    def submit_distributor(self, dist_in: DistributorCreate) -> LeadSubmissionResponse:
        dist = self.repo.create_distributor(dist_in)
        # Dispatch notification to channel expansion team & confirmation to applicant
        email_service.send_distributor_notification(dist)
        email_service.send_distributor_customer_confirmation(dist)
        return LeadSubmissionResponse(
            success=True,
            message="Your dealership / distributor partnership application has been received. A confirmation email with your application reference ID has been sent, and our channel expansion manager will reach out shortly.",
            reference_id=dist.reference_id,
        )

    def submit_contact(self, contact_in: ContactCreate) -> LeadSubmissionResponse:
        contact = self.repo.create_contact(contact_in)
        # Dispatch notification to support desk & confirmation to customer
        email_service.send_contact_notification(contact)
        email_service.send_contact_customer_confirmation(contact)
        return LeadSubmissionResponse(
            success=True,
            message="Thank you for reaching out. A confirmation email with your inquiry reference ID has been sent to your email, and our team will reach out to you shortly.",
            reference_id=contact.reference_id,
        )

