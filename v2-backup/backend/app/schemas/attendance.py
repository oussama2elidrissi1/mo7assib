from pydantic import BaseModel
from datetime import datetime, date, time
from decimal import Decimal
from typing import Optional
from app.models.attendance import AttendanceStatus


class CheckInRequest(BaseModel):
    employee_id: int
    project_id: int
    date: date
    check_in: time
    notes: Optional[str] = None
    supervisor_note: Optional[str] = None
    tasks_completed: Optional[str] = None
    photo_count: int = 0


class CheckOutRequest(BaseModel):
    check_out: time


class MarkAbsentRequest(BaseModel):
    employee_id: int
    project_id: int
    date: date
    notes: Optional[str] = None


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    project_id: int
    date: date
    check_in: Optional[time]
    check_out: Optional[time]
    worked_hours: Optional[Decimal]
    overtime_hours: Optional[Decimal]
    status: AttendanceStatus
    notes: Optional[str]
    supervisor_note: Optional[str]
    tasks_completed: Optional[str]
    photo_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
