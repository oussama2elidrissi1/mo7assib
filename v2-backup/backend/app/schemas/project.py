from pydantic import BaseModel
from datetime import datetime, date
from decimal import Decimal
from typing import Optional
from app.models.project import ClientType, ProjectType, ProjectStatus


class ProjectCreate(BaseModel):
    name: str
    client_type: ClientType
    location: str
    city: Optional[str] = None
    address: Optional[str] = None
    project_type: ProjectType
    status: ProjectStatus = ProjectStatus.draft
    start_date: Optional[date] = None
    estimated_end_date: Optional[date] = None
    agreed_price: Optional[Decimal] = None
    estimated_budget: Optional[Decimal] = None
    current_progress: Optional[Decimal] = None
    estimated_duration_days: Optional[int] = None
    description: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    client_type: Optional[ClientType] = None
    location: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    project_type: Optional[ProjectType] = None
    status: Optional[ProjectStatus] = None
    start_date: Optional[date] = None
    estimated_end_date: Optional[date] = None
    agreed_price: Optional[Decimal] = None
    estimated_budget: Optional[Decimal] = None
    current_progress: Optional[Decimal] = None
    estimated_duration_days: Optional[int] = None
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    client_type: ClientType
    location: str
    city: Optional[str]
    address: Optional[str]
    project_type: ProjectType
    status: ProjectStatus
    start_date: Optional[date]
    estimated_end_date: Optional[date]
    agreed_price: Optional[Decimal]
    estimated_budget: Optional[Decimal]
    current_progress: Optional[Decimal]
    estimated_duration_days: Optional[int]
    description: Optional[str]
    created_by: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectProgress(BaseModel):
    project_id: int
    total_tasks: int
    completed_tasks: int
    progress_percentage: float


class ProjectFinancialSummary(BaseModel):
    project_id: int
    agreed_price: Decimal
    manual_expenses: Decimal
    labor_cost: Decimal
    total_expenses: Decimal
    estimated_margin: Decimal
