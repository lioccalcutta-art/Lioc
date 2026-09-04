from typing import List, Optional, Dict
from pydantic import BaseModel, Field, EmailStr


class FacilityAuditRequest(BaseModel):
    facility_name: Optional[str] = Field(None, description="Optional facility/company name")
    facility_type: str = Field(
        ...,
        description="Type of facility: hotels_guest_houses, restaurants_cafes, hospitals_healthcare, corporate_offices, schools_colleges, facility_management, residential_estate",
    )
    floor_area_sqft: float = Field(..., ge=500, le=1000000, description="Total cleanable floor area in square feet")
    units_count: int = Field(default=10, ge=1, le=5000, description="Number of guest rooms, beds, dining seats, or workstations")
    restrooms_count: int = Field(default=2, ge=1, le=500, description="Total washrooms / toilet blocks")
    footfall_level: str = Field(
        default="MODERATE",
        description="Footfall intensity: LOW, MODERATE, HIGH, VERY_HIGH_24X7",
    )
    has_commercial_kitchen: bool = Field(default=False, description="Whether facility has active food prep / kitchen")
    challenges: List[str] = Field(
        default_factory=list,
        description="List of specific challenges: hard_water, heavy_grease, high_infection_risk, marble_floors, odor_issues, insect_pest_risk",
    )
    current_monthly_spend: Optional[float] = Field(
        None, ge=0, description="Optional estimated current monthly cleaning budget in INR"
    )


class ChemicalConsumptionItem(BaseModel):
    zone: str
    product_name: str
    product_slug: str
    sku: str
    monthly_concentrate_litres: float
    ready_to_use_yield_litres: float
    dilution_ratio: str
    packaging_recommendation: str
    estimated_retail_cost: float
    lioc_direct_cost: float
    monthly_savings: float
    usage_guideline: str


class ZoneBreakdown(BaseModel):
    zone_name: str
    zone_icon: str
    primary_focus: str
    monthly_litres: float
    items: List[ChemicalConsumptionItem]


class ROISummary(BaseModel):
    estimated_monthly_retail_cost: float
    lioc_monthly_direct_cost: float
    monthly_savings: float
    annual_savings: float
    savings_percentage: float
    total_diluted_cleaning_solution_litres: float
    cost_per_litre_diluted: float


class HousekeepingSOP(BaseModel):
    frequency: str  # Daily Morning, Midday Refresh, Evening Close, Weekly Deep Clean
    shift: str
    area: str
    chemical_used: str
    dilution_ratio: str
    application_method: str
    safety_gear: str


class FacilityAuditResponse(BaseModel):
    audit_id: str
    facility_type_label: str
    floor_area_sqft: float
    units_count: int
    restrooms_count: int
    footfall_multiplier: float
    total_monthly_concentrate_litres: float
    total_ready_solution_litres: float
    zones: List[ZoneBreakdown]
    roi: ROISummary
    sops: List[HousekeepingSOP]
    executive_summary: str
    recommended_product_slugs: List[str]


class AuditLeadSubmit(BaseModel):
    audit_id: str
    full_name: str = Field(..., min_length=2, max_length=150)
    company_name: str = Field(..., min_length=2, max_length=200)
    email: EmailStr
    phone_number: str = Field(..., min_length=7, max_length=50)
    city: str = Field(..., min_length=2, max_length=100)
    additional_notes: Optional[str] = None
    audit_summary: Optional[Dict] = None
    turnstile_token: Optional[str] = None
