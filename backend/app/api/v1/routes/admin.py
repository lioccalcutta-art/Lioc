from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.core.config import settings
from backend.app.core.rate_limit import limiter
from backend.app.core.security import (
    verify_password,
    create_access_token,
    get_current_admin,
)
from backend.app.schemas.admin import (
    AdminLoginRequest,
    AdminTokenResponse,
    AdminUserResponse,
    AdminStatsResponse,
    AdminLeadItem,
    AdminLeadsListResponse,
    LeadStatusUpdateRequest,
)
from backend.app.repositories.leads_repo import LeadsRepository
from backend.app.models.leads import (
    QuoteRequest,
    SampleRequest,
    DistributorApplication,
    ContactMessage,
)

router = APIRouter()


@router.post("/login", response_model=AdminTokenResponse, summary="CEO & Admin Login")
@limiter.limit("5/minute")
def admin_login(request: Request, payload: AdminLoginRequest):
    """Authenticate CEO / Admin with email and password."""
    # Case-insensitive email check & constant-time password check
    if payload.email.strip().lower() != settings.ADMIN_EMAIL.strip().lower():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    stored_credential = settings.ADMIN_PASSWORD_HASH or settings.ADMIN_PASSWORD
    if not stored_credential or not verify_password(payload.password, stored_credential):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(
        payload={"sub": settings.ADMIN_EMAIL, "role": settings.ADMIN_ROLE, "name": settings.ADMIN_NAME}
    )

    return AdminTokenResponse(
        access_token=token,
        token_type="bearer",
        admin_user=AdminUserResponse(
            email=settings.ADMIN_EMAIL,
            name=settings.ADMIN_NAME,
            role=settings.ADMIN_ROLE,
        ),
    )


@router.get("/me", response_model=AdminUserResponse, summary="Get Current Admin Profile")
def get_admin_profile(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    """Validate token and return current admin identity."""
    return AdminUserResponse(
        email=current_admin["email"],
        name=current_admin["name"],
        role=current_admin["role"],
    )


@router.get("/stats", response_model=AdminStatsResponse, summary="Get Executive Dashboard KPIs")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Retrieve high-level lead counts, pending counts and conversion metrics for CEO."""
    repo = LeadsRepository(db)
    return repo.get_stats()


@router.get("/leads", response_model=AdminLeadsListResponse, summary="Get All Customer Inquiries & Leads")
def get_admin_leads(
    lead_type: Optional[str] = Query(None, description="Filter by type: quote, sample, distributor, contact, or all"),
    status: Optional[str] = Query(None, description="Filter by status e.g. NEW, PENDING, CONTACTED, CONVERTED"),
    search: Optional[str] = Query(None, description="Search query by name, company, phone, email, reference ID, city"),
    db: Session = Depends(get_db),
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Retrieve full customer inquiry table with comprehensive search and filtering."""
    repo = LeadsRepository(db)
    items = repo.get_unified_leads(lead_type=lead_type, status=status, search=search)

    quotes_count = db.query(QuoteRequest).count()
    samples_count = db.query(SampleRequest).count()
    distributors_count = db.query(DistributorApplication).count()
    contacts_count = db.query(ContactMessage).count()

    return AdminLeadsListResponse(
        total=len(items),
        quotes_count=quotes_count,
        samples_count=samples_count,
        distributors_count=distributors_count,
        contacts_count=contacts_count,
        items=items,
    )


@router.patch("/leads/{lead_type}/{lead_id}/status", summary="Update Customer Inquiry Status & Notes")
def update_lead_status(
    lead_type: str,
    lead_id: int,
    payload: LeadStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Update lead workflow status (e.g., NEW -> CONTACTED -> CONVERTED) and internal CEO remarks."""
    repo = LeadsRepository(db)
    success = repo.update_lead_status(
        lead_type=lead_type,
        lead_id=lead_id,
        status=payload.status,
        internal_notes=payload.internal_notes,
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inquiry with ID {lead_id} of type {lead_type} not found",
        )
    return {"success": True, "message": "Lead status updated successfully"}


@router.delete("/leads/{lead_type}/{lead_id}", summary="Delete / Archive Lead")
def delete_lead(
    lead_type: str,
    lead_id: int,
    db: Session = Depends(get_db),
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Remove a customer inquiry entry."""
    repo = LeadsRepository(db)
    success = repo.delete_lead(lead_type=lead_type, lead_id=lead_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inquiry with ID {lead_id} not found",
        )
    return {"success": True, "message": "Inquiry removed successfully"}
