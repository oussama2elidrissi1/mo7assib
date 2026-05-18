import enum
from sqlalchemy import Column, Integer, String, Enum, Numeric, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class PaymentStatus(str, enum.Enum):
    unpaid = "unpaid"
    partial = "partial"
    paid = "paid"


class SalaryCalculation(Base, TimestampMixin):
    __tablename__ = "salary_calculations"
    __table_args__ = (
        UniqueConstraint("employee_id", "project_id", "month", name="uq_salary_emp_proj_month"),
    )

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    month = Column(String(7), nullable=False)  # YYYY-MM
    worked_days = Column(Numeric(5, 2), default=0)
    base_salary = Column(Numeric(15, 2), default=0)
    overtime_hours = Column(Numeric(5, 2), default=0)
    overtime_amount = Column(Numeric(15, 2), default=0)
    advances_total = Column(Numeric(15, 2), default=0)
    deductions = Column(Numeric(15, 2), default=0)
    net_salary = Column(Numeric(15, 2), default=0)
    paid_amount = Column(Numeric(15, 2), default=0)
    remaining_amount = Column(Numeric(15, 2), default=0)
    payment_status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.unpaid)
    notes = Column(Text)

    employee = relationship("Employee", back_populates="salary_calculations")
    project = relationship("Project", back_populates="salary_calculations")
    payments = relationship("SalaryPayment", back_populates="salary_calculation")
