from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.services.catalog_service import CatalogService
from backend.app.schemas.category import CategoryRead

router = APIRouter()


@router.get("", response_model=List[CategoryRead], summary="Get all active product categories")
def get_categories(db: Session = Depends(get_db)):
    service = CatalogService(db)
    return service.get_categories()
