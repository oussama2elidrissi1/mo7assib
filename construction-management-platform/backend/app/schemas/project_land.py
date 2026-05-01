from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional


class ProjectLandCreate(BaseModel):
    surface_area_m2: Optional[Decimal] = None
    land_address: Optional[str] = None
    floors_count: Optional[int] = 0
    has_basement: Optional[bool] = False
    basement_count: Optional[int] = 0
    notes: Optional[str] = None


class ProjectLandUpdate(ProjectLandCreate):
    pass


class ProjectLandResponse(BaseModel):
    id: int
    project_id: int
    surface_area_m2: Optional[Decimal]
    land_address: Optional[str]
    floors_count: Optional[int]
    has_basement: Optional[bool]
    basement_count: Optional[int]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
