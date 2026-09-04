from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class LeadSubmissionResponse(BaseModel):
    success: bool = True
    message: str
    reference_id: str


# ==========================
# Quote Schemas
# ==========================
class QuoteCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    company_name: str = Field(..., min_length=2, max_length=200)
    phone_number: str = Field(..., min_length=7, max_length=50)
    email: EmailStr
    business_type: str = Field(..., min_length=2, max_length=100)
    city: str = Field(..., min_length=2, max_length=100)
    product_interested_in: Optional[str] = None
    estimated_quantity: Optional[str] = None
    monthly_requirement: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "DIRECT"
    turnstile_token: Optional[str] = None


class QuoteRead(BaseModel):
    id: int
    reference_id: str
    full_name: str
    company_name: str
    phone_number: str
    email: str
    business_type: str
    city: str
    product_interested_in: Optional[str] = None
    estimated_quantity: Optional[str] = None
    monthly_requirement: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "DIRECT"
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================
# Sample Request Schemas
# ==========================
class SampleCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    company_name: str = Field(..., min_length=2, max_length=200)
    phone_number: str = Field(..., min_length=7, max_length=50)
    email: EmailStr
    business_type: str = Field(..., min_length=2, max_length=100)
    business_address: str = Field(..., min_length=5, max_length=500)
    city: str = Field(..., min_length=2, max_length=100)
    product_interested_in: str = Field(..., min_length=2, max_length=255)
    expected_monthly_requirement: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "DIRECT"
    turnstile_token: Optional[str] = None


class SampleRead(BaseModel):
    id: int
    reference_id: str
    full_name: str
    company_name: str
    phone_number: str
    email: str
    business_type: str
    business_address: str
    city: str
    product_interested_in: str
    expected_monthly_requirement: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "DIRECT"
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================
# Distributor Application Schemas
# ==========================
class DistributorCreate(BaseModel):
    applicant_name: str = Field(..., min_length=2, max_length=150)
    company_name: str = Field(..., min_length=2, max_length=200)
    phone_number: str = Field(..., min_length=7, max_length=50)
    email: EmailStr
    gst_number: Optional[str] = None
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    years_experience: Optional[str] = None
    current_products_distributed: Optional[str] = None
    investment_capacity: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "DIRECT"
    turnstile_token: Optional[str] = None


class DistributorRead(BaseModel):
    id: int
    reference_id: str
    applicant_name: str
    company_name: str
    phone_number: str
    email: str
    gst_number: Optional[str] = None
    city: str
    state: str
    years_experience: Optional[str] = None
    current_products_distributed: Optional[str] = None
    investment_capacity: Optional[str] = None
    source: Optional[str] = "DIRECT"
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================
# Contact Message Schemas
# ==========================
class ContactCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone_number: str = Field(..., min_length=7, max_length=50)
    company_name: Optional[str] = None
    subject: Optional[str] = None
    message: str = Field(..., min_length=5)
    source: Optional[str] = "DIRECT"
    turnstile_token: Optional[str] = None


class ContactRead(BaseModel):
    id: int
    reference_id: str
    full_name: str
    email: str
    phone_number: str
    company_name: Optional[str] = None
    subject: Optional[str] = None
    message: str
    source: Optional[str] = "DIRECT"
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
