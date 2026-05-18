from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.task_service import create_task, get_task, update_task, delete_task, get_tasks
from app.api.deps import get_current_user, require_not_viewer
from app.models.user import User

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=201)
def create(data: TaskCreate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return create_task(db, data)


@router.get("/{task_id}", response_model=TaskResponse)
def get(task_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_task(db, task_id)


@router.put("/{task_id}", response_model=TaskResponse)
def update(task_id: int, data: TaskUpdate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return update_task(db, task_id, data)


@router.delete("/{task_id}", status_code=204)
def delete(task_id: int, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    delete_task(db, task_id)
