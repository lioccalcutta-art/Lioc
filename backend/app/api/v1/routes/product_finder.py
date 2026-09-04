from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.services.recommendation_service import RecommendationService
from backend.app.schemas.recommendation import (
    ProductFinderOptionsResponse,
    ProductFinderResponse,
)

router = APIRouter()


@router.get("/options", response_model=ProductFinderOptionsResponse, summary="Get Product Finder Options")
def get_product_finder_options(db: Session = Depends(get_db)):
    """
    Returns all active industries, categories, and contextual challenge presets
    for the interactive Product Finder wizard.
    """
    service = RecommendationService(db)
    return service.get_options()


@router.get("/recommendations", response_model=ProductFinderResponse, summary="Get Product Recommendations")
def get_product_recommendations(
    industry_id: Optional[int] = Query(None, description="Target Industry ID"),
    category_id: Optional[int] = Query(None, description="Target Product Category ID"),
    context: Optional[str] = Query(None, max_length=100, description="Specific Cleaning Challenge Context"),
    limit: int = Query(6, ge=1, le=20, description="Number of recommendations to return"),
    db: Session = Depends(get_db),
):
    """
    Returns ranked product recommendations based on business type, cleaning requirement,
    and optional specific operational challenges.
    """
    service = RecommendationService(db)
    return service.get_recommendations(
        industry_id=industry_id,
        category_id=category_id,
        context=context,
        limit=limit,
    )
