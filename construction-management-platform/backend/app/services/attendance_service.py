from datetime import timedelta
from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.attendance import Attendance, AttendanceStatus
from app.schemas.attendance import CheckInRequest, CheckOutRequest, MarkAbsentRequest


def _get_record(db: Session, attendance_id: int) -> Attendance:
    rec = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return rec


def check_in(db: Session, data: CheckInRequest) -> Attendance:
    existing = db.query(Attendance).filter(
        Attendance.employee_id == data.employee_id,
        Attendance.date == data.date,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance already recorded for this employee on this date",
        )
    rec = Attendance(
        employee_id=data.employee_id,
        project_id=data.project_id,
        date=data.date,
        check_in=data.check_in,
        status=AttendanceStatus.present,
        notes=data.notes,
        supervisor_note=data.supervisor_note,
        tasks_completed=data.tasks_completed,
        photo_count=data.photo_count,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


def check_out(db: Session, attendance_id: int, data: CheckOutRequest) -> Attendance:
    rec = _get_record(db, attendance_id)
    if rec.check_in and data.check_out <= rec.check_in:
        raise HTTPException(status_code=400, detail="Check-out time must be after check-in time")
    rec.check_out = data.check_out
    if rec.check_in:
        from datetime import datetime
        dt_in = datetime.combine(rec.date, rec.check_in)
        dt_out = datetime.combine(rec.date, data.check_out)
        delta = dt_out - dt_in
        rec.worked_hours = Decimal(str(round(delta.seconds / 3600, 2)))
        standard_hours = Decimal("8")
        rec.overtime_hours = rec.worked_hours - standard_hours if rec.worked_hours > standard_hours else Decimal("0")
    db.commit()
    db.refresh(rec)
    return rec


def mark_absent(db: Session, data: MarkAbsentRequest) -> Attendance:
    existing = db.query(Attendance).filter(
        Attendance.employee_id == data.employee_id,
        Attendance.date == data.date,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Attendance already recorded")
    rec = Attendance(
        employee_id=data.employee_id,
        project_id=data.project_id,
        date=data.date,
        status=AttendanceStatus.absent,
        notes=data.notes,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


def get_project_attendance(db: Session, project_id: int, date_filter=None) -> list[Attendance]:
    q = db.query(Attendance).filter(Attendance.project_id == project_id)
    if date_filter:
        q = q.filter(Attendance.date == date_filter)
    return q.all()
