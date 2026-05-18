from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional
from app.models.document import RelatedType


class DocumentResponse(BaseModel):
    id: int
    project_id: int
    related_type: RelatedType
    related_id: Optional[int]
    file_name: str
    file_url: str
    mime_type: Optional[str]
    file_size: Optional[Decimal]
    uploaded_by: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
