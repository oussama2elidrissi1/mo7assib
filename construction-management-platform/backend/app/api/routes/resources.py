from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.resource import ResourceCreate, ResourceUpdate, ResourceResponse
from app.services.resource_service import create_resource, get_resource, update_resource, delete_resource, get_resources
from app.api.deps import get_current_user, require_not_viewer
from app.models.user import User

router = APIRouter(prefix="/resources", tags=["resources"])


@router.post("", response_model=ResourceResponse, status_code=201)
def create(data: ResourceCreate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return create_resource(db, data)


@router.get("/{resource_id}", response_model=ResourceResponse)
def get(resource_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_resource(db, resource_id)


@router.put("/{resource_id}", response_model=ResourceResponse)
def update(resource_id: int, data: ResourceUpdate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return update_resource(db, resource_id, data)


@router.delete("/{resource_id}", status_code=204)
def delete(resource_id: int, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    delete_resource(db, resource_id)
