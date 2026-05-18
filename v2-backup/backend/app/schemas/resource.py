from pydantic import BaseModel
from datetime import datetime, date
from decimal import Decimal
from typing import Optional
from app.models.resource import ResourceType


class ResourceCreate(BaseModel):
    project_id: int
    type: ResourceType
    title: str
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    supplier_name: Optional[str] = None
    supplier_phone: Optional[str] = None
    purchase_date: Optional[date] = None
    file_url: Optional[str] = None


class ResourceUpdate(BaseModel):
    type: Optional[ResourceType] = None
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    supplier_name: Optional[str] = None
    supplier_phone: Optional[str] = None
    purchase_date: Optional[date] = None
    file_url: Optional[str] = None


class ResourceResponse(BaseModel):
    id: int
    project_id: int
    type: ResourceType
    title: str
    description: Optional[str]
    amount: Optional[Decimal]
    supplier_name: Optional[str]
    supplier_phone: Optional[str]
    purchase_date: Optional[date]
    file_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
