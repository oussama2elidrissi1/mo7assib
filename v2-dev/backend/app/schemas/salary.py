from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional
from app.models.salary import PaymentStatus
from app.schemas.project_cycle import SalaryPaymentResponse


class SalaryCalculateRequest(BaseModel):
    employee_id: int
    project_id: int
    month: str  # YYYY-MM
    overtime_rate: Decimal = Decimal("1.5")
    deductions: Decimal = Decimal("0")
    notes: Optional[str] = None


class SalaryPaymentUpdate(BaseModel):
    paid_amount: Decimal
    notes: Optional[str] = None


class SalaryResponse(BaseModel):
    id: int
    employee_id: int
    project_id: int
    month: str
    worked_days: Decimal
    base_salary: Decimal
    overtime_hours: Decimal
    overtime_amount: Decimal
    advances_total: Decimal
    deductions: Decimal
    net_salary: Decimal
    paid_amount: Decimal
    remaining_amount: Decimal
    payment_status: PaymentStatus
    notes: Optional[str]
    payments: list[SalaryPaymentResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
