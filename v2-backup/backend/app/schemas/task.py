from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional
from app.models.task import TaskCategory, TaskStatus, TaskPriority


class TaskCreate(BaseModel):
    project_id: int
    assigned_to: Optional[int] = None
    title: str
    description: Optional[str] = None
    category: TaskCategory = TaskCategory.other
    status: TaskStatus = TaskStatus.todo
    priority: TaskPriority = TaskPriority.medium
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class TaskUpdate(BaseModel):
    assigned_to: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[TaskCategory] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class TaskResponse(BaseModel):
    id: int
    project_id: int
    assigned_to: Optional[int]
    title: str
    description: Optional[str]
    category: TaskCategory
    status: TaskStatus
    priority: TaskPriority
    start_date: Optional[date]
    end_date: Optional[date]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
