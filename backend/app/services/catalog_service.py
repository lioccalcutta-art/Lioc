from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.repositories.category_repo import CategoryRepository
from backend.app.repositories.industry_repo import IndustryRepository
from backend.app.repositories.product_repo import ProductRepository
from backend.app.schemas.category import CategoryRead
from backend.app.schemas.industry import IndustryRead
from backend.app.schemas.product import ProductListItem, ProductDetail


class CatalogService:
    def __init__(self, db: Session):
        self.category_repo = CategoryRepository(db)
        self.industry_repo = IndustryRepository(db)
        self.product_repo = ProductRepository(db)

    def get_categories(self) -> List[CategoryRead]:
        categories = self.category_repo.get_all_active()
        return [
            CategoryRead(
                id=c.id,
                name=c.name,
                slug=c.slug,
                description=c.description,
                icon=c.icon,
                image_url=c.image_url,
                display_order=c.display_order,
                is_active=c.is_active,
                product_count=len(c.products),
                created_at=c.created_at,
                updated_at=c.updated_at,
            )
            for c in categories
        ]

    def get_industries(self) -> List[IndustryRead]:
        industries = self.industry_repo.get_all_active()
        return [IndustryRead.model_validate(i) for i in industries]

    def get_industry_by_slug(self, slug: str) -> Optional[IndustryRead]:
        industry = self.industry_repo.get_by_slug(slug)
        if not industry:
            return None
        return IndustryRead.model_validate(industry)

    def get_products(
        self,
        category_slug: Optional[str] = None,
        industry_slug: Optional[str] = None,
        is_featured: Optional[bool] = None,
        is_bestseller: Optional[bool] = None,
        search: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[ProductListItem]:
        products = self.product_repo.get_products(
            category_slug=category_slug,
            industry_slug=industry_slug,
            is_featured=is_featured,
            is_bestseller=is_bestseller,
            search=search,
            limit=limit,
            offset=offset,
        )
        return [
            ProductListItem(
                id=p.id,
                name=p.name,
                slug=p.slug,
                sku=p.sku,
                category_id=p.category_id,
                category_name=p.category.name if p.category else None,
                category_slug=p.category.slug if p.category else None,
                short_description=p.short_description,
                product_image=p.product_image,
                available_sizes=p.available_sizes,
                status=p.status,
                is_featured=p.is_featured,
                is_bestseller=p.is_bestseller,
                display_order=p.display_order,
            )
            for p in products
        ]

    def get_product_by_slug(self, slug: str) -> Optional[ProductDetail]:
        product = self.product_repo.get_by_slug(slug)
        if not product:
            return None
        return ProductDetail.model_validate(product)
