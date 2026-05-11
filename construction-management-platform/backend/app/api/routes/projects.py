from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectProgress
from app.schemas.project_land import ProjectLandCreate, ProjectLandResponse
from app.schemas.building import BuildingCreate, BuildingUpdate, BuildingResponse
from app.schemas.employee import EmployeeResponse
from app.schemas.task import TaskResponse
from app.schemas.resource import ResourceResponse
from app.schemas.expense import ExpenseResponse
from app.schemas.document import DocumentResponse
from app.schemas.project_cycle import (
    DailySiteReportCreate,
    DailySiteReportResponse,
    ProjectAssignmentCreate,
    ProjectAssignmentResponse,
    ProjectBudgetCreate,
    ProjectBudgetResponse,
    ProjectDocumentResponse,
    ProjectFinancialSummaryV2,
    ProjectOverviewResponse,
    ProjectPhaseCreate,
    ProjectPhaseResponse,
    ProjectSalarySummaryResponse,
    MaterialDeliveryResponse,
)
from app.services import (
    project_service, land_service, building_service,
    employee_service, task_service, resource_service, expense_service, document_service,
)
from app.services import project_lifecycle_service
from app.api.deps import get_current_user, require_not_viewer
from app.models.user import User

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectResponse])
def list_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_service.get_projects(db, skip=skip, limit=limit)


@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(data: ProjectCreate, db: Session = Depends(get_db), user: User = Depends(require_not_viewer)):
    return project_service.create_project(db, data, user.id)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_service.get_project(db, project_id)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return project_service.update_project(db, project_id, data)


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: int, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    project_service.delete_project(db, project_id)


@router.get("/{project_id}/progress", response_model=ProjectProgress)
def project_progress(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_service.get_project_progress(db, project_id)


@router.get("/{project_id}/financial-summary", response_model=ProjectFinancialSummaryV2)
def financial_summary(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_lifecycle_service.get_project_financial_summary(db, project_id)


@router.get("/{project_id}/overview", response_model=ProjectOverviewResponse)
def project_overview(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_lifecycle_service.get_project_overview(db, project_id)


@router.put("/{project_id}/budget", response_model=ProjectBudgetResponse)
def upsert_budget(project_id: int, data: ProjectBudgetCreate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return project_lifecycle_service.upsert_project_budget(db, project_id, data)


@router.get("/{project_id}/phases", response_model=list[ProjectPhaseResponse])
def get_phases(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_lifecycle_service.get_project_phases(db, project_id)


@router.post("/{project_id}/phases", response_model=list[ProjectPhaseResponse])
def save_phases(project_id: int, data: list[ProjectPhaseCreate], db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    if data:
        project_lifecycle_service.replace_project_phases(db, project_id, data)
    return project_lifecycle_service.get_project_phases(db, project_id)


@router.get("/{project_id}/daily-report", response_model=DailySiteReportResponse | None)
def get_daily_report(project_id: int, report_date: date | None = Query(None), db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_lifecycle_service.get_daily_report(db, project_id, report_date)


@router.post("/{project_id}/daily-report", response_model=DailySiteReportResponse)
def save_daily_report(project_id: int, data: DailySiteReportCreate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return project_lifecycle_service.upsert_daily_report(db, project_id, data)


@router.get("/{project_id}/team", response_model=list[ProjectAssignmentResponse])
def project_team(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_lifecycle_service.get_project_team(db, project_id)


@router.post("/{project_id}/assign-employees", response_model=list[ProjectAssignmentResponse])
def assign_employees(project_id: int, data: list[ProjectAssignmentCreate], db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    project_lifecycle_service.assign_project_employees(db, project_id, data)
    return project_lifecycle_service.get_project_team(db, project_id)


@router.get("/{project_id}/salary-summary", response_model=ProjectSalarySummaryResponse)
def salary_summary(project_id: int, month: str | None = Query(None), db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_lifecycle_service.get_project_salary_summary(db, project_id, month)


@router.get("/{project_id}/documents-v2", response_model=list[ProjectDocumentResponse])
def project_documents(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_lifecycle_service.get_project_documents(db, project_id)


@router.get("/{project_id}/material-deliveries", response_model=list[MaterialDeliveryResponse])
def material_deliveries(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return project_lifecycle_service.get_material_deliveries(db, project_id)


# Land endpoints
@router.post("/{project_id}/land", response_model=ProjectLandResponse)
def upsert_land(project_id: int, data: ProjectLandCreate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return land_service.upsert_land(db, project_id, data)


@router.get("/{project_id}/land", response_model=ProjectLandResponse)
def get_land(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return land_service.get_land(db, project_id)


@router.put("/{project_id}/land", response_model=ProjectLandResponse)
def update_land(project_id: int, data: ProjectLandCreate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return land_service.upsert_land(db, project_id, data)


# Building endpoints
@router.get("/{project_id}/buildings", response_model=list[BuildingResponse])
def list_buildings(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return building_service.get_buildings(db, project_id)


@router.get("/{project_id}/employees", response_model=list[EmployeeResponse])
def list_employees(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return employee_service.get_employees(db, project_id)


@router.get("/{project_id}/tasks", response_model=list[TaskResponse])
def list_tasks(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return task_service.get_tasks(db, project_id)


@router.get("/{project_id}/resources", response_model=list[ResourceResponse])
def list_resources(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return resource_service.get_resources(db, project_id)


@router.get("/{project_id}/expenses", response_model=list[ExpenseResponse])
def list_expenses(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return expense_service.get_expenses(db, project_id)


@router.get("/{project_id}/documents", response_model=list[DocumentResponse])
def list_documents(project_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return document_service.get_documents(db, project_id)
