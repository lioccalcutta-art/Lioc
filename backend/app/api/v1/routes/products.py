from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.services.catalog_service import CatalogService
from backend.app.schemas.product import ProductListItem, ProductDetail

router = APIRouter()


@router.get("", response_model=List[ProductListItem], summary="List products with filtering")
def get_products(
    category: Optional[str] = Query(None, description="Category slug"),
    industry: Optional[str] = Query(None, description="Industry slug"),
    featured: Optional[bool] = Query(None, description="Filter featured products"),
    bestseller: Optional[bool] = Query(None, description="Filter bestseller products"),
    search: Optional[str] = Query(None, description="Search query string"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    service = CatalogService(db)
    return service.get_products(
        category_slug=category,
        industry_slug=industry,
        is_featured=featured,
        is_bestseller=bestseller,
        search=search,
        limit=limit,
        offset=offset,
    )


@router.get("/{slug}", response_model=ProductDetail, summary="Get full product details by slug")
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    service = CatalogService(db)
    product = service.get_product_by_slug(slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug '{slug}' not found",
        )
    return product
