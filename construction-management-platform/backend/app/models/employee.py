import enum
from sqlalchemy import Column, Integer, String, Enum, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class EmployeeRole(str, enum.Enum):
    engineer = "engineer"
    site_supervisor = "site_supervisor"
    maalem = "maalem"
    worker = "worker"
    accountant = "accountant"
    other = "other"


class Employee(Base, TimestampMixin):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    role = Column(Enum(EmployeeRole), nullable=False)
    phone = Column(String(50))
    daily_salary = Column(Numeric(10, 2), default=0)
    is_active = Column(Boolean, default=True, nullable=False)

    project = relationship("Project", back_populates="employees")
    attendance = relationship("Attendance", back_populates="employee")
