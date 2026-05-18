from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional


class ProjectLandCreate(BaseModel):
    surface_area_m2: Optional[Decimal] = None
    land_address: Optional[str] = None
    title_reference: Optional[str] = None
    floors_count: Optional[int] = 0
    has_basement: Optional[bool] = False
    basement_count: Optional[int] = 0
    contract_scope: Optional[str] = None
    terrain_documents: Optional[str] = None
    notes: Optional[str] = None


class ProjectLandUpdate(ProjectLandCreate):
    pass


class ProjectLandResponse(BaseModel):
    id: int
    project_id: int
    surface_area_m2: Optional[Decimal]
    land_address: Optional[str]
    title_reference: Optional[str]
    floors_count: Optional[int]
    has_basement: Optional[bool]
    basement_count: Optional[int]
    contract_scope: Optional[str]
    terrain_documents: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
