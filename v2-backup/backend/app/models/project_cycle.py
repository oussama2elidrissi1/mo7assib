import enum
from sqlalchemy import Boolean, Column, Date, Enum, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class ProjectPhaseKey(str, enum.Enum):
    earthwork = "earthwork"
    foundation = "foundation"
    structure = "structure"
    electricity = "electricity"
    plumbing = "plumbing"
    plaster = "plaster"
    tiling = "tiling"
    painting = "painting"
    finishing = "finishing"
    delivery = "delivery"


class ProjectPhaseStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    delayed = "delayed"


class AssignmentRole(str, enum.Enum):
    project_manager = "project_manager"
    site_supervisor = "site_supervisor"
    maalem = "maalem"
    worker = "worker"
    accountant = "accountant"
    other = "other"


class DeliveryStatus(str, enum.Enum):
    ordered = "ordered"
    delivered = "delivered"
    consumed = "consumed"


class ProjectBudget(Base, TimestampMixin):
    __tablename__ = "project_budgets"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    labor_budget = Column(Numeric(15, 2), nullable=False, default=0)
    materials_budget = Column(Numeric(15, 2), nullable=False, default=0)
    equipment_budget = Column(Numeric(15, 2), nullable=False, default=0)
    other_budget = Column(Numeric(15, 2), nullable=False, default=0)
    estimated_margin = Column(Numeric(15, 2), nullable=False, default=0)
    budget_total = Column(Numeric(15, 2), nullable=False, default=0)

    project = relationship("Project", back_populates="budget")


class ProjectPhase(Base, TimestampMixin):
    __tablename__ = "project_phases"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(120), nullable=False)
    phase_key = Column(Enum(ProjectPhaseKey), nullable=False)
    sequence = Column(Integer, nullable=False, default=0)
    status = Column(Enum(ProjectPhaseStatus), nullable=False, default=ProjectPhaseStatus.pending)
    start_date = Column(Date)
    end_date = Column(Date)
    progress_percentage = Column(Numeric(5, 2), nullable=False, default=0)
    budget_planned = Column(Numeric(15, 2), nullable=False, default=0)
    actual_cost = Column(Numeric(15, 2), nullable=False, default=0)
    notes = Column(Text)

    project = relationship("Project", back_populates="phases")


class ProjectAssignment(Base, TimestampMixin):
    __tablename__ = "project_assignments"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    assignment_role = Column(Enum(AssignmentRole), nullable=False)
    daily_salary = Column(Numeric(10, 2), nullable=False, default=0)
    work_hours_per_day = Column(Numeric(4, 1), nullable=False, default=8)
    is_primary = Column(Boolean, nullable=False, default=False)

    project = relationship("Project", back_populates="assignments")
    employee = relationship("Employee", back_populates="assignments")


class DailySiteReport(Base, TimestampMixin):
    __tablename__ = "daily_site_reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    report_date = Column(Date, nullable=False, index=True)
    attendance_completed = Column(Boolean, nullable=False, default=False)
    completed_tasks = Column(Text)
    supervisor_note = Column(Text)
    photo_urls = Column(Text)
    deliveries_received = Column(Integer, nullable=False, default=0)
    expenses_added = Column(Integer, nullable=False, default=0)

    project = relationship("Project", back_populates="daily_reports")


class Supplier(Base, TimestampMixin):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50))
    city = Column(String(120))
    specialty = Column(String(120))

    deliveries = relationship("MaterialDelivery", back_populates="supplier")


class MaterialDelivery(Base, TimestampMixin):
    __tablename__ = "material_deliveries"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    material_name = Column(String(255), nullable=False)
    quantity = Column(Numeric(12, 2), nullable=False, default=0)
    unit = Column(String(30), nullable=False, default="u")
    unit_price = Column(Numeric(12, 2), nullable=False, default=0)
    total_price = Column(Numeric(15, 2), nullable=False, default=0)
    delivery_date = Column(Date, nullable=False)
    status = Column(Enum(DeliveryStatus), nullable=False, default=DeliveryStatus.ordered)
    stock_quantity = Column(Numeric(12, 2), nullable=False, default=0)
    notes = Column(Text)

    project = relationship("Project", back_populates="material_deliveries")
    supplier = relationship("Supplier", back_populates="deliveries")


class SalaryPayment(Base, TimestampMixin):
    __tablename__ = "salary_payments"

    id = Column(Integer, primary_key=True, index=True)
    salary_calculation_id = Column(Integer, ForeignKey("salary_calculations.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(15, 2), nullable=False, default=0)
    payment_date = Column(Date, nullable=False)
    payment_method = Column(String(50), nullable=False, default="cash")
    notes = Column(Text)

    salary_calculation = relationship("SalaryCalculation", back_populates="payments")
