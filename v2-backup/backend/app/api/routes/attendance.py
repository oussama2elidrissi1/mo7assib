from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from app.db.session import get_db
from app.schemas.attendance import CheckInRequest, CheckOutRequest, MarkAbsentRequest, AttendanceResponse
from app.services.attendance_service import check_in, check_out, mark_absent, get_project_attendance
from app.api.deps import get_current_user, require_not_viewer
from app.models.user import User

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("/check-in", response_model=AttendanceResponse, status_code=201)
def do_check_in(data: CheckInRequest, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return check_in(db, data)


@router.put("/{attendance_id}/checkout", response_model=AttendanceResponse)
def do_check_out(attendance_id: int, data: CheckOutRequest, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return check_out(db, attendance_id, data)


@router.post("/mark-absent", response_model=AttendanceResponse, status_code=201)
def do_mark_absent(data: MarkAbsentRequest, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return mark_absent(db, data)


@router.get("/project/{project_id}", response_model=list[AttendanceResponse])
def project_attendance(
    project_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return get_project_attendance(db, project_id)


@router.get("/project/{project_id}/daily", response_model=list[AttendanceResponse])
def daily_attendance(
    project_id: int,
    date: date = Query(...),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return get_project_attendance(db, project_id, date_filter=date)
