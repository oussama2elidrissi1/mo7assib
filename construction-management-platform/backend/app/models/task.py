import enum
from sqlalchemy import Column, Integer, String, Enum, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class TaskCategory(str, enum.Enum):
    foundation = "foundation"
    structure = "structure"
    masonry = "masonry"
    plumbing = "plumbing"
    electricity = "electricity"
    finishing = "finishing"
    other = "other"


class TaskStatus(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"
    blocked = "blocked"


class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Task(Base, TimestampMixin):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_to = Column(Integer, ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(Enum(TaskCategory), nullable=False, default=TaskCategory.other)
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.todo)
    priority = Column(Enum(TaskPriority), nullable=False, default=TaskPriority.medium)
    start_date = Column(Date)
    end_date = Column(Date)

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("Employee", foreign_keys=[assigned_to])
