from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.services.project_service import get_project


def get_employees(db: Session, project_id: int) -> list[Employee]:
    get_project(db, project_id)
    return db.query(Employee).filter(Employee.project_id == project_id).all()


def get_employee(db: Session, employee_id: int) -> Employee:
    e = db.query(Employee).filter(Employee.id == employee_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Employee not found")
    return e


def create_employee(db: Session, data: EmployeeCreate) -> Employee:
    get_project(db, data.project_id)
    e = Employee(**data.model_dump())
    db.add(e)
    db.commit()
    db.refresh(e)
    return e


def update_employee(db: Session, employee_id: int, data: EmployeeUpdate) -> Employee:
    e = get_employee(db, employee_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(e, field, value)
    db.commit()
    db.refresh(e)
    return e


def delete_employee(db: Session, employee_id: int) -> None:
    e = get_employee(db, employee_id)
    db.delete(e)
    db.commit()
