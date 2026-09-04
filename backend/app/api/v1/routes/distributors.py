from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.services.lead_service import LeadService
from backend.app.services.antispam_service import verify_turnstile_token
from backend.app.schemas.leads import DistributorCreate, LeadSubmissionResponse
from backend.app.core.rate_limit import limiter

router = APIRouter()


@router.post(
    "",
    response_model=LeadSubmissionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a Dealership & Distributor Application",
)
@limiter.limit("5/10minute")
async def create_distributor_application(
    request: Request,
    dist_in: DistributorCreate,
    db: Session = Depends(get_db),
):
    # Verify anti-spam token
    client_ip = request.client.host if request.client else None
    is_human = await verify_turnstile_token(dist_in.turnstile_token, remote_ip=client_ip)
    if not is_human:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Anti-spam verification failed. Please refresh and try again.",
        )

    service = LeadService(db)
    return service.submit_distributor(dist_in)
