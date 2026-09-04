from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from backend.app.models.product import Product
from backend.app.models.category import ProductCategory
from backend.app.models.industry import Industry


class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_products(
        self,
        category_slug: Optional[str] = None,
        industry_slug: Optional[str] = None,
        is_featured: Optional[bool] = None,
        is_bestseller: Optional[bool] = None,
        search: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Product]:
        query = (
            self.db.query(Product)
            .options(joinedload(Product.category))
            .filter(Product.status == "ACTIVE")
        )

        if category_slug:
            query = query.join(Product.category).filter(ProductCategory.slug == category_slug)

        if industry_slug:
            query = query.join(Product.industries).filter(Industry.slug == industry_slug)

        if is_featured is not None:
            query = query.filter(Product.is_featured == is_featured)

        if is_bestseller is not None:
            query = query.filter(Product.is_bestseller == is_bestseller)

        if search:
            search_filter = f"%{search.lower()}%"
            query = query.filter(
                (Product.name.ilike(search_filter))
                | (Product.short_description.ilike(search_filter))
                | (Product.benefits.ilike(search_filter))
            )

        return (
            query.order_by(Product.display_order.asc(), Product.name.asc())
            .offset(offset)
            .limit(limit)
            .all()
        )

    def get_by_slug(self, slug: str) -> Optional[Product]:
        return (
            self.db.query(Product)
            .options(
                joinedload(Product.category),
                joinedload(Product.images),
                joinedload(Product.industries),
            )
            .filter(Product.slug == slug, Product.status == "ACTIVE")
            .first()
        )

    def get_by_id(self, product_id: int) -> Optional[Product]:
        return (
            self.db.query(Product)
            .options(
                joinedload(Product.category),
                joinedload(Product.images),
                joinedload(Product.industries),
            )
            .filter(Product.id == product_id)
            .first()
        )
