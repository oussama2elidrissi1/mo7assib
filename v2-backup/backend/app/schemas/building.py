from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional


class BuildingCreate(BaseModel):
    project_id: int
    name: str
    surface_area_m2: Optional[Decimal] = None
    number_of_floors: Optional[int] = 0
    number_of_apartments: Optional[int] = 0
    notes: Optional[str] = None


class BuildingUpdate(BaseModel):
    name: Optional[str] = None
    surface_area_m2: Optional[Decimal] = None
    number_of_floors: Optional[int] = None
    number_of_apartments: Optional[int] = None
    notes: Optional[str] = None


class BuildingResponse(BaseModel):
    id: int
    project_id: int
    name: str
    surface_area_m2: Optional[Decimal]
    number_of_floors: Optional[int]
    number_of_apartments: Optional[int]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
