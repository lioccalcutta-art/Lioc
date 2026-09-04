from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models.industry import Industry


class IndustryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_active(self) -> List[Industry]:
        return (
            self.db.query(Industry)
            .filter(Industry.is_active == True)
            .order_by(Industry.display_order.asc(), Industry.name.asc())
            .all()
        )

    def get_by_slug(self, slug: str) -> Optional[Industry]:
        return (
            self.db.query(Industry)
            .filter(Industry.slug == slug, Industry.is_active == True)
            .first()
        )

    def get_by_id(self, industry_id: int) -> Optional[Industry]:
        return (
            self.db.query(Industry)
            .filter(Industry.id == industry_id)
            .first()
        )
