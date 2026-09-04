from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminUserResponse(BaseModel):
    email: str
    name: str
    role: str


class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_user: AdminUserResponse


class AdminLeadItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    lead_type: str # "quote", "sample", "distributor", "contact"
    reference_id: str
    name: str
    company_name: Optional[str] = None
    phone_number: str
    email: str
    city: str
    state: Optional[str] = None
    business_type: Optional[str] = None
    business_address: Optional[str] = None
    product_or_subject: Optional[str] = None
    quantity_or_detail: Optional[str] = None
    monthly_requirement: Optional[str] = None
    gst_number: Optional[str] = None
    investment_capacity: Optional[str] = None
    experience: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "DIRECT"
    status: str
    internal_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class AdminLeadsListResponse(BaseModel):
    total: int
    quotes_count: int
    samples_count: int
    distributors_count: int
    contacts_count: int
    items: List[AdminLeadItem]


class LeadStatusUpdateRequest(BaseModel):
    status: str
    internal_notes: Optional[str] = None


class AdminStatsResponse(BaseModel):
    total_inquiries: int
    quotes_count: int
    samples_count: int
    distributors_count: int
    contacts_count: int
    new_leads_count: int
    action_required_count: int
    converted_count: int
