from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional
from app.models.employee import EmployeeRole


class EmployeeCreate(BaseModel):
    project_id: int
    name: str
    role: EmployeeRole
    phone: Optional[str] = None
    daily_salary: Optional[Decimal] = None
    is_active: bool = True


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[EmployeeRole] = None
    phone: Optional[str] = None
    daily_salary: Optional[Decimal] = None
    is_active: Optional[bool] = None


class EmployeeResponse(BaseModel):
    id: int
    project_id: int
    name: str
    role: EmployeeRole
    phone: Optional[str]
    daily_salary: Optional[Decimal]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
