from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.project_service import get_project


def get_tasks(db: Session, project_id: int) -> list[Task]:
    get_project(db, project_id)
    return db.query(Task).filter(Task.project_id == project_id).all()


def get_task(db: Session, task_id: int) -> Task:
    t = db.query(Task).filter(Task.id == task_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    return t


def create_task(db: Session, data: TaskCreate) -> Task:
    get_project(db, data.project_id)
    t = Task(**data.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


def update_task(db: Session, task_id: int, data: TaskUpdate) -> Task:
    t = get_task(db, task_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(t, field, value)
    db.commit()
    db.refresh(t)
    return t


def delete_task(db: Session, task_id: int) -> None:
    t = get_task(db, task_id)
    db.delete(t)
    db.commit()
