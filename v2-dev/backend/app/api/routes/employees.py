from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from app.services.employee_service import create_employee, get_employee, update_employee, delete_employee, get_employees, get_all_employees
from app.api.deps import get_current_user, require_not_viewer
from app.models.user import User

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeResponse])
def list_all(skip: int = 0, limit: int = 200, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_all_employees(db, skip=skip, limit=limit)


@router.post("", response_model=EmployeeResponse, status_code=201)
def create(data: EmployeeCreate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return create_employee(db, data)


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get(employee_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_employee(db, employee_id)


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update(employee_id: int, data: EmployeeUpdate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return update_employee(db, employee_id, data)


@router.delete("/{employee_id}", status_code=204)
def delete(employee_id: int, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    delete_employee(db, employee_id)
