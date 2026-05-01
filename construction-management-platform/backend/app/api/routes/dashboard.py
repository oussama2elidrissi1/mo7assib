from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.db.session import get_db
from app.models.project import Project, ProjectStatus
from app.models.expense import Expense
from app.models.attendance import Attendance
from app.api.deps import get_current_user
from app.models.user import User
from pydantic import BaseModel
from decimal import Decimal


class DashboardResponse(BaseModel):
    total_projects: int
    active_projects: int
    finished_projects: int
    total_expenses: Decimal
    today_attendance_count: int


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
def dashboard(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    total = db.query(func.count(Project.id)).scalar() or 0
    active = db.query(func.count(Project.id)).filter(Project.status == ProjectStatus.active).scalar() or 0
    finished = db.query(func.count(Project.id)).filter(Project.status == ProjectStatus.finished).scalar() or 0
    total_exp = db.query(func.coalesce(func.sum(Expense.amount), 0)).scalar()
    today = db.query(func.count(Attendance.id)).filter(Attendance.date == date.today()).scalar() or 0
    return DashboardResponse(
        total_projects=total,
        active_projects=active,
        finished_projects=finished,
        total_expenses=Decimal(str(total_exp)),
        today_attendance_count=today,
    )
