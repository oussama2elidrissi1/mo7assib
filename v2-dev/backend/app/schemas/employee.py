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
    cin: Optional[str] = None
    job_title: Optional[str] = None
    daily_salary: Optional[Decimal] = None
    hourly_wage: Optional[Decimal] = None
    work_hours_per_day: Optional[Decimal] = Decimal("8")
    is_active: bool = True


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[EmployeeRole] = None
    phone: Optional[str] = None
    cin: Optional[str] = None
    job_title: Optional[str] = None
    daily_salary: Optional[Decimal] = None
    hourly_wage: Optional[Decimal] = None
    work_hours_per_day: Optional[Decimal] = None
    is_active: Optional[bool] = None


class EmployeeResponse(BaseModel):
    id: int
    project_id: int
    name: str
    role: EmployeeRole
    phone: Optional[str]
    cin: Optional[str]
    job_title: Optional[str]
    daily_salary: Optional[Decimal]
    hourly_wage: Optional[Decimal]
    work_hours_per_day: Optional[Decimal]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
