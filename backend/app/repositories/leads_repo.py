from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from backend.app.models.leads import (
    QuoteRequest,
    SampleRequest,
    DistributorApplication,
    ContactMessage,
)

from backend.app.schemas.leads import (
    QuoteCreate,
    SampleCreate,
    DistributorCreate,
    ContactCreate,
)

from backend.app.schemas.admin import AdminLeadItem, AdminStatsResponse
from backend.app.core.security import generate_reference_id


class LeadsRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_quote(self, quote_in: QuoteCreate) -> QuoteRequest:
        reference_id = generate_reference_id("LQ")
        db_quote = QuoteRequest(
            reference_id=reference_id,
            full_name=quote_in.full_name,
            company_name=quote_in.company_name,
            phone_number=quote_in.phone_number,
            email=quote_in.email,
            business_type=quote_in.business_type,
            city=quote_in.city,
            product_interested_in=quote_in.product_interested_in,
            estimated_quantity=quote_in.estimated_quantity,
            monthly_requirement=quote_in.monthly_requirement,
            message=quote_in.message,
            source=quote_in.source or "DIRECT",
            status="NEW",
        )
        self.db.add(db_quote)
        self.db.commit()
        self.db.refresh(db_quote)
        return db_quote

    def create_sample(self, sample_in: SampleCreate) -> SampleRequest:
        reference_id = generate_reference_id("LS")
        db_sample = SampleRequest(
            reference_id=reference_id,
            full_name=sample_in.full_name,
            company_name=sample_in.company_name,
            phone_number=sample_in.phone_number,
            email=sample_in.email,
            business_type=sample_in.business_type,
            business_address=sample_in.business_address,
            city=sample_in.city,
            product_interested_in=sample_in.product_interested_in,
            expected_monthly_requirement=sample_in.expected_monthly_requirement,
            message=sample_in.message,
            source=sample_in.source or "DIRECT",
            status="PENDING",
        )
        self.db.add(db_sample)
        self.db.commit()
        self.db.refresh(db_sample)
        return db_sample

    def create_distributor(self, dist_in: DistributorCreate) -> DistributorApplication:
        reference_id = generate_reference_id("LD")
        db_dist = DistributorApplication(
            reference_id=reference_id,
            applicant_name=dist_in.applicant_name,
            company_name=dist_in.company_name,
            phone_number=dist_in.phone_number,
            email=dist_in.email,
            gst_number=dist_in.gst_number,
            city=dist_in.city,
            state=dist_in.state,
            years_experience=dist_in.years_experience,
            current_products_distributed=dist_in.current_products_distributed,
            investment_capacity=dist_in.investment_capacity,
            message=dist_in.message,
            source=dist_in.source or "DIRECT",
            status="NEW",
        )
        self.db.add(db_dist)
        self.db.commit()
        self.db.refresh(db_dist)
        return db_dist

    def create_contact(self, contact_in: ContactCreate) -> ContactMessage:
        reference_id = generate_reference_id("LC")
        db_contact = ContactMessage(
            reference_id=reference_id,
            full_name=contact_in.full_name,
            email=contact_in.email,
            phone_number=contact_in.phone_number,
            company_name=contact_in.company_name,
            subject=contact_in.subject,
            message=contact_in.message,
            source=contact_in.source or "DIRECT",
            status="NEW",
        )
        self.db.add(db_contact)
        self.db.commit()
        self.db.refresh(db_contact)
        return db_contact

    # ---------------- ADMIN METHODS ----------------

    def get_stats(self) -> AdminStatsResponse:
        quotes_count = self.db.query(QuoteRequest).count()
        samples_count = self.db.query(SampleRequest).count()
        distributors_count = self.db.query(DistributorApplication).count()
        contacts_count = self.db.query(ContactMessage).count()

        new_quotes = self.db.query(QuoteRequest).filter(QuoteRequest.status == "NEW").count()
        pending_samples = self.db.query(SampleRequest).filter(SampleRequest.status.in_(["PENDING", "NEW"])).count()
        new_dist = self.db.query(DistributorApplication).filter(DistributorApplication.status == "NEW").count()
        new_contact = self.db.query(ContactMessage).filter(ContactMessage.status == "NEW").count()

        conv_quotes = self.db.query(QuoteRequest).filter(QuoteRequest.status == "CONVERTED").count()
        conv_samples = self.db.query(SampleRequest).filter(SampleRequest.status == "CONVERTED").count()
        conv_dist = self.db.query(DistributorApplication).filter(DistributorApplication.status == "APPROVED").count()

        total = quotes_count + samples_count + distributors_count + contacts_count
        action_required = new_quotes + pending_samples + new_dist + new_contact
        converted = conv_quotes + conv_samples + conv_dist

        return AdminStatsResponse(
            total_inquiries=total,
            quotes_count=quotes_count,
            samples_count=samples_count,
            distributors_count=distributors_count,
            contacts_count=contacts_count,
            new_leads_count=action_required,
            action_required_count=action_required,
            converted_count=converted,
        )

    def get_unified_leads(
        self,
        lead_type: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[AdminLeadItem]:
        items: List[AdminLeadItem] = []

        # 1. Quotes
        if not lead_type or lead_type in ["all", "quote", "quotes"]:
            q = self.db.query(QuoteRequest)
            if status and status != "ALL":
                q = q.filter(QuoteRequest.status == status)
            for r in q.all():
                items.append(
                    AdminLeadItem(
                        id=r.id,
                        lead_type="quote",
                        reference_id=r.reference_id,
                        name=r.full_name,
                        company_name=r.company_name,
                        phone_number=r.phone_number,
                        email=r.email,
                        city=r.city,
                        business_type=r.business_type,
                        product_or_subject=r.product_interested_in or "General Commercial Range",
                        quantity_or_detail=r.estimated_quantity,
                        monthly_requirement=r.monthly_requirement,
                        message=r.message,
                        source=r.source or "DIRECT",
                        status=r.status,
                        internal_notes=r.internal_notes,
                        created_at=r.created_at,
                        updated_at=r.updated_at,
                    )
                )

        # 2. Samples
        if not lead_type or lead_type in ["all", "sample", "samples"]:
            q = self.db.query(SampleRequest)
            if status and status != "ALL":
                q = q.filter(SampleRequest.status == status)
            for r in q.all():
                items.append(
                    AdminLeadItem(
                        id=r.id,
                        lead_type="sample",
                        reference_id=r.reference_id,
                        name=r.full_name,
                        company_name=r.company_name,
                        phone_number=r.phone_number,
                        email=r.email,
                        city=r.city,
                        business_type=r.business_type,
                        business_address=r.business_address,
                        product_or_subject=r.product_interested_in,
                        monthly_requirement=r.expected_monthly_requirement,
                        message=r.message,
                        source=r.source or "DIRECT",
                        status=r.status,
                        internal_notes=r.internal_notes,
                        created_at=r.created_at,
                        updated_at=r.updated_at,
                    )
                )

        # 3. Distributors
        if not lead_type or lead_type in ["all", "distributor", "distributors"]:
            q = self.db.query(DistributorApplication)
            if status and status != "ALL":
                q = q.filter(DistributorApplication.status == status)
            for r in q.all():
                items.append(
                    AdminLeadItem(
                        id=r.id,
                        lead_type="distributor",
                        reference_id=r.reference_id,
                        name=r.applicant_name,
                        company_name=r.company_name,
                        phone_number=r.phone_number,
                        email=r.email,
                        city=r.city,
                        state=r.state,
                        gst_number=r.gst_number,
                        investment_capacity=r.investment_capacity,
                        experience=r.years_experience,
                        product_or_subject=r.current_products_distributed or "Distribution Partnership",
                        message=r.message,
                        source=r.source or "DIRECT",
                        status=r.status,
                        internal_notes=r.internal_notes,
                        created_at=r.created_at,
                        updated_at=r.updated_at,
                    )
                )

        # 4. Contacts
        if not lead_type or lead_type in ["all", "contact", "contacts"]:
            q = self.db.query(ContactMessage)
            if status and status != "ALL":
                q = q.filter(ContactMessage.status == status)
            for r in q.all():
                items.append(
                    AdminLeadItem(
                        id=r.id,
                        lead_type="contact",
                        reference_id=r.reference_id,
                        name=r.full_name,
                        company_name=r.company_name or "N/A",
                        phone_number=r.phone_number,
                        email=r.email,
                        city="Kolkata (General)",
                        product_or_subject=r.subject or "Customer Inquiry",
                        message=r.message,
                        source=r.source or "DIRECT",
                        status=r.status,
                        internal_notes=r.internal_notes,
                        created_at=r.created_at,
                        updated_at=r.updated_at,
                    )
                )

        # Filter by search string if provided
        if search:
            s = search.strip().lower()
            items = [
                i
                for i in items
                if s in i.name.lower()
                or (i.company_name and s in i.company_name.lower())
                or s in i.phone_number.lower()
                or s in i.email.lower()
                or s in i.reference_id.lower()
                or s in i.city.lower()
                or (i.product_or_subject and s in i.product_or_subject.lower())
            ]

        # Sort newest first
        items.sort(key=lambda x: x.created_at, reverse=True)
        return items

    def update_lead_status(
        self,
        lead_type: str,
        lead_id: int,
        status: str,
        internal_notes: Optional[str] = None,
    ) -> bool:
        model_map = {
            "quote": QuoteRequest,
            "sample": SampleRequest,
            "distributor": DistributorApplication,
            "contact": ContactMessage,
        }
        model = model_map.get(lead_type.lower())
        if not model:
            return False

        item = self.db.query(model).filter(model.id == lead_id).first()
        if not item:
            return False

        item.status = status
        if internal_notes is not None:
            item.internal_notes = internal_notes
        item.updated_at = datetime.now(timezone.utc)
        self.db.commit()
        return True

    def delete_lead(self, lead_type: str, lead_id: int) -> bool:
        model_map = {
            "quote": QuoteRequest,
            "sample": SampleRequest,
            "distributor": DistributorApplication,
            "contact": ContactMessage,
        }
        model = model_map.get(lead_type.lower())
        if not model:
            return False

        item = self.db.query(model).filter(model.id == lead_id).first()
        if not item:
            return False

        self.db.delete(item)
        self.db.commit()
        return True
