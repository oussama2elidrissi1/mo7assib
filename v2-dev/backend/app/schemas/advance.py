from pydantic import BaseModel
from datetime import datetime, date
from decimal import Decimal
from typing import Optional
from app.models.advance import AdvanceStatus


class AdvanceCreate(BaseModel):
    employee_id: int
    project_id: int
    requested_amount: Decimal
    reason: Optional[str] = None
    advance_date: date
    month: Optional[str] = None  # YYYY-MM


class AdvanceUpdate(BaseModel):
    approved_amount: Optional[Decimal] = None
    status: Optional[AdvanceStatus] = None
    reason: Optional[str] = None


class AdvanceResponse(BaseModel):
    id: int
    employee_id: int
    project_id: int
    requested_amount: Decimal
    approved_amount: Optional[Decimal]
    reason: Optional[str]
    status: AdvanceStatus
    approved_by: Optional[int]
    advance_date: date
    month: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
