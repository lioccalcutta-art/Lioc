from datetime import datetime, timezone
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database.base import Base
from backend.app.models.industry import product_industries

if TYPE_CHECKING:
    from backend.app.models.category import ProductCategory
    from backend.app.models.industry import Industry


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    alt_text: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)

    product: Mapped["Product"] = relationship("Product", back_populates="images")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    sku: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, unique=True, index=True)
    
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("product_categories.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    
    short_description: Mapped[str] = mapped_column(String(500), nullable=False)
    full_description: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Media & Presentation
    product_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    available_sizes: Mapped[Optional[str]] = mapped_column(String(255), nullable=True) # e.g. "500ml, 5L, 20L, 50L Drum"
    
    # Technical & Application Specs
    usage_instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    benefits: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # JSON or newline separated
    safety_information: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    technical_information: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # pH, dilution ratio, active agents
    
    # State & Highlighting
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", index=True) # ACTIVE, DRAFT, OUT_OF_STOCK
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_bestseller: Mapped[bool] = mapped_column(Boolean, default=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    category: Mapped["ProductCategory"] = relationship("ProductCategory", back_populates="products")
    images: Mapped[List["ProductImage"]] = relationship(
        "ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.display_order"
    )
    industries: Mapped[List["Industry"]] = relationship(
        "Industry", secondary=product_industries, back_populates="products"
    )
