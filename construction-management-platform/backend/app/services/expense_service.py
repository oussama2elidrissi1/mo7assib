from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from app.services.project_service import get_project


def get_expenses(db: Session, project_id: int) -> list[Expense]:
    get_project(db, project_id)
    return db.query(Expense).filter(Expense.project_id == project_id).all()


def get_expense(db: Session, expense_id: int) -> Expense:
    e = db.query(Expense).filter(Expense.id == expense_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Expense not found")
    return e


def create_expense(db: Session, data: ExpenseCreate) -> Expense:
    get_project(db, data.project_id)
    e = Expense(**data.model_dump())
    db.add(e)
    db.commit()
    db.refresh(e)
    return e


def update_expense(db: Session, expense_id: int, data: ExpenseUpdate) -> Expense:
    e = get_expense(db, expense_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(e, field, value)
    db.commit()
    db.refresh(e)
    return e


def delete_expense(db: Session, expense_id: int) -> None:
    e = get_expense(db, expense_id)
    db.delete(e)
    db.commit()
