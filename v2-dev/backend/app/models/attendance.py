import enum
from sqlalchemy import Column, Integer, String, Enum, Date, Time, Numeric, ForeignKey, UniqueConstraint, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin, TenantMixin


class AttendanceStatus(str, enum.Enum):
    present = "present"
    absent = "absent"
    half_day = "half_day"


class Attendance(Base, TimestampMixin, TenantMixin):
    __tablename__ = "attendance"
    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="uq_attendance_employee_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    check_in = Column(Time)
    check_out = Column(Time)
    worked_hours = Column(Numeric(5, 2))
    overtime_hours = Column(Numeric(5, 2), default=0)
    status = Column(Enum(AttendanceStatus), nullable=False, default=AttendanceStatus.present)
    notes = Column(Text)
    supervisor_note = Column(Text)
    tasks_completed = Column(Text)
    photo_count = Column(Integer, nullable=False, default=0)

    employee = relationship("Employee", back_populates="attendance")
    project = relationship("Project", back_populates="attendance")
