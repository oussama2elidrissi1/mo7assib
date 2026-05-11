from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from decimal import Decimal
from pydantic import BaseModel
from typing import Optional
from app.db.session import get_db
from app.models.project import Project, ProjectStatus
from app.models.expense import Expense
from app.models.attendance import Attendance, AttendanceStatus
from app.models.employee import Employee
from app.models.advance import Advance, AdvanceStatus
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.project_cycle import DashboardSummaryResponse
from app.services import project_lifecycle_service


class DashboardResponse(BaseModel):
    total_projects: int
    active_projects: int
    finished_projects: int
    total_expenses: Decimal
    today_attendance_count: int
    active_employees: int
    monthly_expenses: Decimal
    total_agreed_price: Decimal
    total_estimated_budget: Decimal
    estimated_margin: Decimal
    budget_overrun_rate: Optional[float]


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
def dashboard(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    total = db.query(func.count(Project.id)).scalar() or 0
    active = db.query(func.count(Project.id)).filter(Project.status == ProjectStatus.active).scalar() or 0
    finished = db.query(func.count(Project.id)).filter(Project.status == ProjectStatus.finished).scalar() or 0

    total_exp = db.query(func.coalesce(func.sum(Expense.amount), 0)).scalar()
    total_exp = Decimal(str(total_exp))

    today = db.query(func.count(Attendance.id)).filter(
        Attendance.date == date.today(),
        Attendance.status == AttendanceStatus.present,
    ).scalar() or 0

    active_emp = db.query(func.count(Employee.id)).filter(Employee.is_active == True).scalar() or 0

    # Monthly expenses (current month)
    today_date = date.today()
    monthly_exp = db.query(func.coalesce(func.sum(Expense.amount), 0)).filter(
        func.extract("year", Expense.expense_date) == today_date.year,
        func.extract("month", Expense.expense_date) == today_date.month,
    ).scalar()
    monthly_exp = Decimal(str(monthly_exp))

    # Financial summary
    total_agreed = db.query(func.coalesce(func.sum(Project.agreed_price), 0)).scalar()
    total_agreed = Decimal(str(total_agreed))

    total_budget = db.query(func.coalesce(func.sum(Project.estimated_budget), 0)).scalar()
    total_budget = Decimal(str(total_budget))

    estimated_margin = total_agreed - total_exp

    budget_overrun_rate = None
    if total_budget > 0:
        budget_overrun_rate = float(round((total_exp / total_budget - 1) * 100, 2))

    return DashboardResponse(
        total_projects=total,
        active_projects=active,
        finished_projects=finished,
        total_expenses=total_exp,
        today_attendance_count=today,
        active_employees=active_emp,
        monthly_expenses=monthly_exp,
        total_agreed_price=total_agreed,
        total_estimated_budget=total_budget,
        estimated_margin=estimated_margin,
        budget_overrun_rate=budget_overrun_rate,
    )


@router.get("/summary", response_model=DashboardSummaryResponse)
def dashboard_summary(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return project_lifecycle_service.get_dashboard_summary(db, user.name)
