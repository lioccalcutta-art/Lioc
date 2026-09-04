from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Text, Integer, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from backend.app.database.base import Base


class QuoteRequest(Base):
    __tablename__ = "quote_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    reference_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    phone_number: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    business_type: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    
    product_interested_in: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    estimated_quantity: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    monthly_requirement: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    source: Mapped[Optional[str]] = mapped_column(String(50), default="DIRECT", nullable=True, index=True) # DIRECT, PRODUCT_FINDER, WHATSAPP
    status: Mapped[str] = mapped_column(String(50), default="NEW", index=True) # NEW, CONTACTED, QUOTATION_SENT, NEGOTIATION, CONVERTED, LOST
    internal_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )


class SampleRequest(Base):
    __tablename__ = "sample_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    reference_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    phone_number: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    business_type: Mapped[str] = mapped_column(String(100), nullable=False)
    business_address: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    
    product_interested_in: Mapped[str] = mapped_column(String(255), nullable=False)
    expected_monthly_requirement: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    source: Mapped[Optional[str]] = mapped_column(String(50), default="DIRECT", nullable=True, index=True) # DIRECT, PRODUCT_FINDER
    status: Mapped[str] = mapped_column(String(50), default="PENDING", index=True) # PENDING, APPROVED, SAMPLE_SENT, FOLLOW_UP, CONVERTED, REJECTED
    courier_tracking_info: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    internal_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )


class DistributorApplication(Base):
    __tablename__ = "distributor_applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    reference_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    
    applicant_name: Mapped[str] = mapped_column(String(150), nullable=False)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    phone_number: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    gst_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    
    years_experience: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    current_products_distributed: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    investment_capacity: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    source: Mapped[Optional[str]] = mapped_column(String(50), default="DIRECT", nullable=True, index=True)
    status: Mapped[str] = mapped_column(String(50), default="NEW", index=True) # NEW, UNDER_REVIEW, CONTACTED, APPROVED, REJECTED
    internal_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    reference_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(50), nullable=False)
    company_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    subject: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    
    source: Mapped[Optional[str]] = mapped_column(String(50), default="DIRECT", nullable=True, index=True)
    status: Mapped[str] = mapped_column(String(50), default="NEW", index=True) # NEW, RESPONDED, CLOSED
    internal_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )
