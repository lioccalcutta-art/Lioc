from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.models.category import ProductCategory
from backend.app.models.product import Product


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_active(self) -> List[ProductCategory]:
        return (
            self.db.query(ProductCategory)
            .filter(ProductCategory.is_active == True)
            .order_by(ProductCategory.display_order.asc(), ProductCategory.name.asc())
            .all()
        )

    def get_by_slug(self, slug: str) -> Optional[ProductCategory]:
        return (
            self.db.query(ProductCategory)
            .filter(ProductCategory.slug == slug, ProductCategory.is_active == True)
            .first()
        )

    def get_by_id(self, category_id: int) -> Optional[ProductCategory]:
        return (
            self.db.query(ProductCategory)
            .filter(ProductCategory.id == category_id)
            .first()
        )
