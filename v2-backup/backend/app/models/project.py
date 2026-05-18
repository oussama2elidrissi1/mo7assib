import enum
from sqlalchemy import Column, Integer, String, Enum, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class ClientType(str, enum.Enum):
    private = "private"
    public = "public"


class ProjectType(str, enum.Enum):
    labor_only = "labor_only"
    labor_with_materials = "labor_with_materials"


class ProjectStatus(str, enum.Enum):
    draft = "draft"
    planned = "planned"
    active = "active"
    paused = "paused"
    finished = "finished"
    cancelled = "cancelled"
    archived = "archived"


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    client_type = Column(Enum(ClientType), nullable=False)
    location = Column(String(255), nullable=False)
    address = Column(String(512))
    city = Column(String(120))
    project_type = Column(Enum(ProjectType), nullable=False)
    status = Column(Enum(ProjectStatus), nullable=False, default=ProjectStatus.draft)
    start_date = Column(Date)
    estimated_end_date = Column(Date)
    agreed_price = Column(Numeric(15, 2), default=0)
    estimated_budget = Column(Numeric(15, 2), default=0)
    current_progress = Column(Numeric(5, 2), default=0)
    estimated_duration_days = Column(Integer)
    description = Column(String(1024))
    created_by = Column(Integer, ForeignKey("users.id"))

    land = relationship("ProjectLand", back_populates="project", uselist=False)
    budget = relationship("ProjectBudget", back_populates="project", uselist=False)
    buildings = relationship("Building", back_populates="project")
    employees = relationship("Employee", back_populates="project")
    assignments = relationship("ProjectAssignment", back_populates="project")
    phases = relationship("ProjectPhase", back_populates="project", order_by="ProjectPhase.sequence")
    daily_reports = relationship("DailySiteReport", back_populates="project")
    tasks = relationship("Task", back_populates="project")
    resources = relationship("Resource", back_populates="project")
    material_deliveries = relationship("MaterialDelivery", back_populates="project")
    expenses = relationship("Expense", back_populates="project")
    documents = relationship("Document", back_populates="project")
    attendance = relationship("Attendance", back_populates="project")
    advances = relationship("Advance", back_populates="project")
    salary_calculations = relationship("SalaryCalculation", back_populates="project")
