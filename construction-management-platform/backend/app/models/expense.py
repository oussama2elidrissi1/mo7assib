import enum
from sqlalchemy import Column, Integer, String, Enum, Date, Numeric, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class ExpenseCategory(str, enum.Enum):
    labor = "labor"
    materials = "materials"
    transport = "transport"
    equipment = "equipment"
    admin = "admin"
    other = "other"


class PaymentMethod(str, enum.Enum):
    cash = "cash"
    bank_transfer = "bank_transfer"
    check = "check"
    card = "card"
    other = "other"


class Expense(Base, TimestampMixin):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(Enum(ExpenseCategory), nullable=False)
    title = Column(String(255), nullable=False)
    amount = Column(Numeric(15, 2), default=0)
    expense_date = Column(Date, nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False, default=PaymentMethod.cash)
    supplier_name = Column(String(255))
    receipt_file_url = Column(String(512))
    notes = Column(Text)

    project = relationship("Project", back_populates="expenses")
