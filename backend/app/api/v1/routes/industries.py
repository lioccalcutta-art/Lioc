from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.services.catalog_service import CatalogService
from backend.app.schemas.industry import IndustryRead

router = APIRouter()


@router.get("", response_model=List[IndustryRead], summary="Get all active industries served")
def get_industries(db: Session = Depends(get_db)):
    service = CatalogService(db)
    return service.get_industries()


@router.get("/{slug}", response_model=IndustryRead, summary="Get industry details by slug")
def get_industry_by_slug(slug: str, db: Session = Depends(get_db)):
    service = CatalogService(db)
    industry = service.get_industry_by_slug(slug)
    if not industry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Industry with slug '{slug}' not found",
        )
    return industry
