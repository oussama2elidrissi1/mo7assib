from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.advance import Advance, AdvanceStatus
from app.schemas.advance import AdvanceCreate, AdvanceUpdate


def get_advances(db: Session, project_id: int | None = None, employee_id: int | None = None) -> list[Advance]:
    q = db.query(Advance)
    if project_id:
        q = q.filter(Advance.project_id == project_id)
    if employee_id:
        q = q.filter(Advance.employee_id == employee_id)
    return q.order_by(Advance.advance_date.desc()).all()


def get_advance(db: Session, advance_id: int) -> Advance:
    advance = db.query(Advance).filter(Advance.id == advance_id).first()
    if not advance:
        raise HTTPException(status_code=404, detail="Advance not found")
    return advance


def create_advance(db: Session, data: AdvanceCreate) -> Advance:
    advance = Advance(**data.model_dump())
    db.add(advance)
    db.commit()
    db.refresh(advance)
    return advance


def update_advance(db: Session, advance_id: int, data: AdvanceUpdate, approver_id: int | None = None) -> Advance:
    advance = get_advance(db, advance_id)
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(advance, field, value)
    if data.status == AdvanceStatus.approved and approver_id:
        advance.approved_by = approver_id
        if advance.approved_amount is None:
            advance.approved_amount = advance.requested_amount
    db.commit()
    db.refresh(advance)
    return advance


def delete_advance(db: Session, advance_id: int) -> None:
    advance = get_advance(db, advance_id)
    db.delete(advance)
    db.commit()
