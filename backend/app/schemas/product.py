from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from backend.app.schemas.category import CategoryRead
from backend.app.schemas.industry import IndustryRead


class ProductImageRead(BaseModel):
    id: int
    image_url: str
    alt_text: Optional[str] = None
    display_order: int = 0
    is_primary: bool = False

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    name: str
    slug: str
    sku: Optional[str] = None
    category_id: int
    short_description: str
    full_description: str
    product_image: Optional[str] = None
    available_sizes: Optional[str] = None
    usage_instructions: Optional[str] = None
    benefits: Optional[str] = None
    safety_information: Optional[str] = None
    technical_information: Optional[str] = None
    status: str = "ACTIVE"
    is_featured: bool = False
    is_bestseller: bool = False
    display_order: int = 0


class ProductCreate(ProductBase):
    industry_ids: Optional[List[int]] = []


class ProductListItem(BaseModel):
    id: int
    name: str
    slug: str
    sku: Optional[str] = None
    category_id: int
    category_name: Optional[str] = None
    category_slug: Optional[str] = None
    short_description: str
    product_image: Optional[str] = None
    available_sizes: Optional[str] = None
    status: str
    is_featured: bool
    is_bestseller: bool
    display_order: int

    model_config = ConfigDict(from_attributes=True)


class ProductDetail(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryRead] = None
    images: List[ProductImageRead] = []
    industries: List[IndustryRead] = []

    model_config = ConfigDict(from_attributes=True)
