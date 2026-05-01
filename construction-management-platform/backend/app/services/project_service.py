from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from decimal import Decimal
from app.models.project import Project
from app.models.task import Task, TaskStatus
from app.models.expense import Expense
from app.models.attendance import Attendance, AttendanceStatus
from app.models.employee import Employee
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectProgress, ProjectFinancialSummary


def get_projects(db: Session, skip: int = 0, limit: int = 100) -> list[Project]:
    return db.query(Project).offset(skip).limit(limit).all()


def get_project(db: Session, project_id: int) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def create_project(db: Session, data: ProjectCreate, created_by: int) -> Project:
    project = Project(**data.model_dump(), created_by=created_by)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(db: Session, project_id: int, data: ProjectUpdate) -> Project:
    project = get_project(db, project_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project_id: int) -> None:
    project = get_project(db, project_id)
    db.delete(project)
    db.commit()


def get_project_progress(db: Session, project_id: int) -> ProjectProgress:
    get_project(db, project_id)
    total = db.query(func.count(Task.id)).filter(Task.project_id == project_id).scalar() or 0
    completed = db.query(func.count(Task.id)).filter(
        Task.project_id == project_id, Task.status == TaskStatus.done
    ).scalar() or 0
    percentage = round((completed / total * 100), 2) if total > 0 else 0.0
    return ProjectProgress(
        project_id=project_id,
        total_tasks=total,
        completed_tasks=completed,
        progress_percentage=percentage,
    )


def get_financial_summary(db: Session, project_id: int) -> ProjectFinancialSummary:
    project = get_project(db, project_id)
    agreed_price = Decimal(str(project.agreed_price or 0))

    manual_expenses = db.query(func.coalesce(func.sum(Expense.amount), 0)).filter(
        Expense.project_id == project_id
    ).scalar()
    manual_expenses = Decimal(str(manual_expenses))

    # labor cost = sum of (worked_hours / 8) * daily_salary per attendance record
    attendance_rows = (
        db.query(Attendance, Employee)
        .join(Employee, Attendance.employee_id == Employee.id)
        .filter(Attendance.project_id == project_id)
        .filter(Attendance.status != AttendanceStatus.absent)
        .all()
    )
    labor_cost = Decimal("0")
    for att, emp in attendance_rows:
        hours = Decimal(str(att.worked_hours or 8))
        daily = Decimal(str(emp.daily_salary or 0))
        labor_cost += (hours / Decimal("8")) * daily

    total_expenses = manual_expenses + labor_cost
    estimated_margin = agreed_price - total_expenses

    return ProjectFinancialSummary(
        project_id=project_id,
        agreed_price=agreed_price,
        manual_expenses=manual_expenses,
        labor_cost=labor_cost,
        total_expenses=total_expenses,
        estimated_margin=estimated_margin,
    )
