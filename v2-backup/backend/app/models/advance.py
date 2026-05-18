import enum
from sqlalchemy import Column, Integer, String, Enum, Date, Numeric, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class AdvanceStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Advance(Base, TimestampMixin):
    __tablename__ = "advances"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    requested_amount = Column(Numeric(15, 2), nullable=False)
    approved_amount = Column(Numeric(15, 2))
    reason = Column(Text)
    status = Column(Enum(AdvanceStatus), nullable=False, default=AdvanceStatus.pending)
    approved_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    advance_date = Column(Date, nullable=False)
    month = Column(String(7))  # YYYY-MM

    employee = relationship("Employee", back_populates="advances")
    project = relationship("Project", back_populates="advances")
