from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services.user_service import get_users, create_user, update_user
from app.api.deps import get_current_user, require_admin
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return get_users(db, skip=skip, limit=limit)


@router.post("", response_model=UserResponse, status_code=201)
def create(data: UserCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return create_user(db, data)


@router.put("/{user_id}", response_model=UserResponse)
def update(user_id: int, data: UserUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return update_user(db, user_id, data)
