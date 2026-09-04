from fastapi import APIRouter
from backend.app.api.v1.routes import (
    health,
    categories,
    products,
    industries,
    quotes,
    samples,
    distributors,
    contact,
    admin,
    product_finder,
    auditor,
    assistant,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(admin.router, prefix="/admin", tags=["CEO & Admin Portal"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(industries.router, prefix="/industries", tags=["Industries"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(product_finder.router, prefix="/product-finder", tags=["Product Finder"])
api_router.include_router(auditor.router, prefix="/auditor", tags=["AI Virtual Hygiene Auditor"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["AI Chemical & Hygiene Assistant"])
api_router.include_router(quotes.router, prefix="/quotes", tags=["Quotes"])
api_router.include_router(samples.router, prefix="/samples", tags=["Samples"])
api_router.include_router(distributors.router, prefix="/distributors", tags=["Distributors"])
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
