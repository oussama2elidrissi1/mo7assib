from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.schemas.salary import SalaryCalculateRequest, SalaryPaymentUpdate, SalaryResponse
from app.services import salary_service
from app.api.deps import get_current_user, require_not_viewer
from app.models.user import User

router = APIRouter(prefix="/salaries", tags=["salaries"])


@router.get("", response_model=list[SalaryResponse])
def list_salaries(
    project_id: Optional[int] = Query(None),
    employee_id: Optional[int] = Query(None),
    month: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return salary_service.get_salaries(db, project_id=project_id, employee_id=employee_id, month=month)


@router.post("/calculate", response_model=SalaryResponse, status_code=201)
def calculate_salary(
    data: SalaryCalculateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_not_viewer),
):
    return salary_service.calculate_salary(db, data)


@router.put("/{salary_id}/payment", response_model=SalaryResponse)
def record_payment(
    salary_id: int,
    data: SalaryPaymentUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_not_viewer),
):
    return salary_service.record_payment(db, salary_id, data)
