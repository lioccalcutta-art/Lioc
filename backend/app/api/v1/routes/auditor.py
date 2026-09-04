from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.services.auditor_service import AuditorService
from backend.app.services.antispam_service import verify_turnstile_token
from backend.app.schemas.auditor import (
    FacilityAuditRequest,
    FacilityAuditResponse,
    AuditLeadSubmit,
)
from backend.app.schemas.leads import LeadSubmissionResponse
from backend.app.core.rate_limit import limiter

router = APIRouter()


@router.post(
    "/calculate",
    response_model=FacilityAuditResponse,
    status_code=status.HTTP_200_OK,
    summary="Compute AI Virtual Facility Hygiene Audit & Chemical Plan",
)
@limiter.limit("20/minute")
def calculate_facility_audit(
    request: Request,
    audit_req: FacilityAuditRequest,
):
    """
    Computes real-time facility chemical requirements, departmental zone breakdown,
    housekeeping standard operating procedure (SOP) dilution ratios, and comparative financial ROI.
    """
    service = AuditorService()
    return service.calculate_audit(audit_req)


@router.post(
    "/submit",
    response_model=LeadSubmissionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save Facility Audit Report and Request Institutional Wholesale Proposal",
)
@limiter.limit("5/10minute")
async def submit_audit_lead(
    request: Request,
    lead_in: AuditLeadSubmit,
    db: Session = Depends(get_db),
):
    """
    Saves the computed facility audit report as a qualified institutional lead,
    dispatches an automated confirmation email to the client with their Reference ID,
    and alerts the LIOC commercial engineering desk.
    """
    client_ip = request.client.host if request.client else None
    is_human = await verify_turnstile_token(lead_in.turnstile_token, remote_ip=client_ip)
    if not is_human:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Anti-spam verification failed. Please refresh and try again.",
        )

    service = AuditorService(db)
    return service.submit_audit_lead(lead_in)
