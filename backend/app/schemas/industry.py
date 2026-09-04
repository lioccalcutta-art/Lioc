from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class IndustryBase(BaseModel):
    name: str
    slug: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    key_challenges: Optional[str] = None
    recommended_solutions: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class IndustryCreate(IndustryBase):
    pass


class IndustryRead(IndustryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
