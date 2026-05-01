from pydantic import BaseModel
from datetime import datetime, date
from decimal import Decimal
from typing import Optional
from app.models.expense import ExpenseCategory, PaymentMethod


class ExpenseCreate(BaseModel):
    project_id: int
    category: ExpenseCategory
    title: str
    amount: Decimal
    expense_date: date
    payment_method: PaymentMethod = PaymentMethod.cash
    supplier_name: Optional[str] = None
    receipt_file_url: Optional[str] = None
    notes: Optional[str] = None


class ExpenseUpdate(BaseModel):
    category: Optional[ExpenseCategory] = None
    title: Optional[str] = None
    amount: Optional[Decimal] = None
    expense_date: Optional[date] = None
    payment_method: Optional[PaymentMethod] = None
    supplier_name: Optional[str] = None
    receipt_file_url: Optional[str] = None
    notes: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    project_id: int
    category: ExpenseCategory
    title: str
    amount: Decimal
    expense_date: date
    payment_method: PaymentMethod
    supplier_name: Optional[str]
    receipt_file_url: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
