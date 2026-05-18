from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.services.expense_service import create_expense, get_expense, update_expense, delete_expense, get_expenses
from app.api.deps import get_current_user, require_not_viewer
from app.models.user import User

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("", response_model=ExpenseResponse, status_code=201)
def create(data: ExpenseCreate, db: Session = Depends(get_db), user: User = Depends(require_not_viewer)):
    return create_expense(db, data, user.id)


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get(expense_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_expense(db, expense_id)


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update(expense_id: int, data: ExpenseUpdate, db: Session = Depends(get_db), user: User = Depends(require_not_viewer)):
    return update_expense(db, expense_id, data, user.id)


@router.delete("/{expense_id}", status_code=204)
def delete(expense_id: int, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    delete_expense(db, expense_id)
