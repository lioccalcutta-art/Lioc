from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session, joinedload
from backend.app.models.product import Product
from backend.app.models.category import ProductCategory
from backend.app.models.industry import Industry
from backend.app.schemas.category import CategoryRead
from backend.app.schemas.industry import IndustryRead
from backend.app.schemas.recommendation import (
    ContextChallengeOption,
    RecommendationProduct,
    RecommendationItem,
    ProductFinderOptionsResponse,
    ProductFinderResponse,
)

CONTEXT_CHALLENGES: List[ContextChallengeOption] = [
    ContextChallengeOption(
        id="daily_maintenance",
        label="Daily Mopping & Routine Cleanliness",
        description="Daily floor and surface maintenance with pleasant fragrance and fast drying.",
        icon="Sparkles",
    ),
    ContextChallengeOption(
        id="heavy_stains",
        label="Tough Limescale & Deep Descaling",
        description="Stubborn hard-water white rings, bathroom scale, and heavy ceramic soil.",
        icon="Droplets",
    ),
    ContextChallengeOption(
        id="grease_oil",
        label="Commercial Grease & Exhaust Oil Removal",
        description="Heavy kitchen grease, fryers, exhaust hoods, and food-service cookware.",
        icon="Flame",
    ),
    ContextChallengeOption(
        id="germ_disinfection",
        label="High-Touch Disinfection & Sanitization",
        description="99.9% broad-spectrum antimicrobial germ kill for public & healthcare zones.",
        icon="ShieldCheck",
    ),
    ContextChallengeOption(
        id="glass_shine",
        label="Streak-Free Glass & Stainless Steel",
        description="Crystal clarity for architectural glass facades, mirrors, and steel fixtures.",
        icon="Sun",
    ),
    ContextChallengeOption(
        id="cost_efficiency",
        label="High-Yield Bulk Concentrates",
        description="Ultra-high dilution ratios to minimize per-litre commercial cleaning costs.",
        icon="Layers",
    ),
]

CONTEXT_KEYWORDS: Dict[str, List[str]] = {
    "daily_maintenance": ["daily", "neutral", "mopping", "citrus", "pine", "routine", "shine"],
    "heavy_stains": ["descaler", "scale", "limescale", "acid", "heavy", "stain", "powershield", "bowl"],
    "grease_oil": ["degreaser", "grease", "oil", "kitchen", "fryer", "dishwash", "exhaust", "kitchenmaster"],
    "germ_disinfection": ["disinfectant", "antibacterial", "germ", "sanitiz", "hospital", "99.9", "antimicrobial"],
    "glass_shine": ["glass", "streak-free", "mirror", "stainless", "crystalview", "gleam", "acrylic"],
    "cost_efficiency": ["concentrate", "dilution", "drum", "50l", "20l", "economical", "yield", "bulk"],
}


class RecommendationService:
    def __init__(self, db: Session):
        self.db = db

    def get_options(self) -> ProductFinderOptionsResponse:
        """Returns available industries, categories, and challenge presets."""
        industries_db = (
            self.db.query(Industry)
            .filter(Industry.is_active == True)
            .order_by(Industry.display_order.asc(), Industry.name.asc())
            .all()
        )
        categories_db = (
            self.db.query(ProductCategory)
            .filter(ProductCategory.is_active == True)
            .order_by(ProductCategory.display_order.asc(), ProductCategory.name.asc())
            .all()
        )

        return ProductFinderOptionsResponse(
            industries=[IndustryRead.model_validate(ind) for ind in industries_db],
            categories=[CategoryRead.model_validate(cat) for cat in categories_db],
            context_challenges=CONTEXT_CHALLENGES,
        )

    def get_recommendations(
        self,
        industry_id: Optional[int] = None,
        category_id: Optional[int] = None,
        context: Optional[str] = None,
        limit: int = 6,
    ) -> ProductFinderResponse:
        """
        Deterministic recommendation engine scoring and ranking products.
        """
        # Resolve target Industry and Category models if IDs provided
        industry_model = (
            self.db.query(Industry).filter(Industry.id == industry_id).first()
            if industry_id
            else None
        )
        category_model = (
            self.db.query(ProductCategory).filter(ProductCategory.id == category_id).first()
            if category_id
            else None
        )

        # Query all active products with joined categories and industries
        active_products = (
            self.db.query(Product)
            .options(
                joinedload(Product.category),
                joinedload(Product.industries),
            )
            .filter(Product.status == "ACTIVE")
            .all()
        )

        scored_items = []
        context_key = (context or "").strip().lower()
        context_terms = CONTEXT_KEYWORDS.get(context_key, [])

        for prod in active_products:
            score = 0
            is_cat_match = category_id is not None and prod.category_id == category_id
            is_ind_match = (
                industry_id is not None
                and industry_model is not None
                and any(ind.id == industry_id for ind in prod.industries)
            )

            # Determine base score and match type
            if is_cat_match and is_ind_match:
                score += 100
                match_type = "EXACT_MATCH"
                ind_name = industry_model.name if industry_model else "your facility"
                cat_name = category_model.name if category_model else "hygiene"
                reason = f"Primary formulation engineered for {ind_name} {cat_name} operations."
            elif is_ind_match:
                score += 65
                match_type = "INDUSTRY_MATCH"
                ind_name = industry_model.name if industry_model else "your sector"
                reason = f"Proven institutional formulation widely utilized across {ind_name}."
            elif is_cat_match:
                score += 55
                match_type = "CATEGORY_MATCH"
                cat_name = category_model.name if category_model else "commercial cleaning"
                reason = f"High-potency commercial solution for institutional {cat_name}."
            else:
                score += 20
                match_type = "GENERAL_MATCH"
                reason = "Institutional-grade commercial hygiene formulation."

            # Contextual Challenge matching boost (+15 pts)
            if context_terms:
                searchable_text = f"{prod.name} {prod.short_description} {prod.full_description} {prod.benefits or ''} {prod.usage_instructions or ''}".lower()
                matched_count = sum(1 for term in context_terms if term in searchable_text)
                if matched_count > 0:
                    score += min(20, 10 + (matched_count * 3))
                    if match_type == "EXACT_MATCH":
                        reason += f" Optimized for {context_key.replace('_', ' ')}."

            # Commercial Flag boosts
            if prod.is_bestseller:
                score += 10
            if prod.is_featured:
                score += 5

            # Extract first benefit as key benefit callout
            key_benefit = None
            if prod.benefits:
                first_benefit = prod.benefits.split("\n")[0].strip()
                if first_benefit:
                    key_benefit = first_benefit

            # Construct summary product schema
            prod_summary = RecommendationProduct(
                id=prod.id,
                name=prod.name,
                slug=prod.slug,
                sku=prod.sku,
                category_id=prod.category_id,
                category_name=prod.category.name if prod.category else None,
                category_slug=prod.category.slug if prod.category else None,
                short_description=prod.short_description,
                product_image=prod.product_image,
                available_sizes=prod.available_sizes,
                usage_instructions=prod.usage_instructions,
                benefits=prod.benefits,
                is_featured=prod.is_featured,
                is_bestseller=prod.is_bestseller,
            )

            scored_items.append({
                "score": score,
                "match_type": match_type,
                "reason": reason,
                "key_benefit": key_benefit,
                "product": prod_summary,
                "display_order": prod.display_order,
            })

        # Sort descending by score, then ascending by display_order
        scored_items.sort(key=lambda x: (-x["score"], x["display_order"], x["product"].name))

        # Take top items up to limit
        top_items = scored_items[:limit]

        recommendations = []
        for rank_idx, item in enumerate(top_items, start=1):
            recommendations.append(
                RecommendationItem(
                    rank=rank_idx,
                    score=item["score"],
                    match_type=item["match_type"],
                    reason=item["reason"],
                    key_benefit=item["key_benefit"],
                    product=item["product"],
                )
            )

        fallback_msg = None
        if not recommendations or (len(recommendations) > 0 and recommendations[0].match_type == "GENERAL_MATCH"):
            fallback_msg = (
                "Need a custom formulation or bulk dilution consultation? "
                "Our chemical specialists can prepare a custom institutional quote for your facility."
            )

        return ProductFinderResponse(
            industry=IndustryRead.model_validate(industry_model) if industry_model else None,
            category=CategoryRead.model_validate(category_model) if category_model else None,
            context_challenge=context,
            total_recommendations=len(recommendations),
            recommendations=recommendations,
            fallback_message=fallback_msg,
        )
