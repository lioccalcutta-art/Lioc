from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.services.ai_service import AISupportService

router = APIRouter()


class AssistantChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User question or inquiry")
    context_product_slug: Optional[str] = None
    facility_type: Optional[str] = None


class ProductSuggestion(BaseModel):
    name: str
    slug: str
    category: str
    product_image: Optional[str] = None
    reason: str


class AssistantChatResponse(BaseModel):
    reply: str
    suggested_products: List[ProductSuggestion] = []
    dilution_guide: Optional[Dict[str, str]] = None
    safety_warnings: List[str] = []
    suggested_questions: List[str] = []
    whatsapp_message: str


@router.post("/chat", response_model=AssistantChatResponse)
async def chat_support(
    request: AssistantChatRequest,
    db: Session = Depends(get_db)
) -> AssistantChatResponse:
    """
    Generative & Grounded Chat Support Endpoint.
    Provides AI-driven recommendations, dilution guidelines, surface safety,
    and product matches from the live catalog.
    """
    ai_service = AISupportService(db)
    result = await ai_service.generate_response(
        user_message=request.message,
        facility_type=request.facility_type
    )

    suggested_products = [
        ProductSuggestion(
            name=p["name"],
            slug=p["slug"],
            category=p["category"],
            product_image=p.get("product_image"),
            reason=p["reason"],
        )
        for p in result.get("suggested_products", [])
    ]

    return AssistantChatResponse(
        reply=result.get("reply", "Thank you for contacting LIOC Support."),
        suggested_products=suggested_products,
        dilution_guide=result.get("dilution_guide"),
        safety_warnings=result.get("safety_warnings", []),
        suggested_questions=result.get("suggested_questions", []),
        whatsapp_message=result.get("whatsapp_message", "Hi LIOC Support Team, please provide more information."),
    )
