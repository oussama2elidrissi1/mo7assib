from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.schemas.advance import AdvanceCreate, AdvanceUpdate, AdvanceResponse
from app.services import advance_service
from app.api.deps import get_current_user, require_not_viewer
from app.models.user import User

router = APIRouter(prefix="/advances", tags=["advances"])


@router.get("", response_model=list[AdvanceResponse])
def list_advances(
    project_id: Optional[int] = Query(None),
    employee_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return advance_service.get_advances(db, project_id=project_id, employee_id=employee_id)


@router.post("", response_model=AdvanceResponse, status_code=201)
def create_advance(data: AdvanceCreate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return advance_service.create_advance(db, data)


@router.get("/{advance_id}", response_model=AdvanceResponse)
def get_advance(advance_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return advance_service.get_advance(db, advance_id)


@router.put("/{advance_id}", response_model=AdvanceResponse)
def update_advance(
    advance_id: int,
    data: AdvanceUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_not_viewer),
):
    return advance_service.update_advance(db, advance_id, data, approver_id=user.id)


@router.delete("/{advance_id}", status_code=204)
def delete_advance(advance_id: int, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    advance_service.delete_advance(db, advance_id)
