from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from backend.app.schemas.category import CategoryRead
from backend.app.schemas.industry import IndustryRead


class ContextChallengeOption(BaseModel):
    id: str
    label: str
    description: str
    icon: Optional[str] = None


class RecommendationProduct(BaseModel):
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
    usage_instructions: Optional[str] = None
    benefits: Optional[str] = None
    is_featured: bool = False
    is_bestseller: bool = False

    model_config = ConfigDict(from_attributes=True)


class RecommendationItem(BaseModel):
    rank: int
    score: int
    match_type: str # "EXACT_MATCH", "INDUSTRY_MATCH", "CATEGORY_MATCH", "GENERAL_MATCH"
    reason: str
    key_benefit: Optional[str] = None
    product: RecommendationProduct


class ProductFinderOptionsResponse(BaseModel):
    industries: List[IndustryRead]
    categories: List[CategoryRead]
    context_challenges: List[ContextChallengeOption]


class ProductFinderResponse(BaseModel):
    industry: Optional[IndustryRead] = None
    category: Optional[CategoryRead] = None
    context_challenge: Optional[str] = None
    total_recommendations: int
    recommendations: List[RecommendationItem]
    fallback_message: Optional[str] = None
