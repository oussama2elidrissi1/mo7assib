from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.building import BuildingCreate, BuildingUpdate, BuildingResponse
from app.services.building_service import create_building, get_building, update_building, delete_building
from app.api.deps import get_current_user, require_not_viewer
from app.models.user import User

router = APIRouter(prefix="/buildings", tags=["buildings"])


@router.post("", response_model=BuildingResponse, status_code=201)
def create(data: BuildingCreate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return create_building(db, data)


@router.get("/{building_id}", response_model=BuildingResponse)
def get(building_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_building(db, building_id)


@router.put("/{building_id}", response_model=BuildingResponse)
def update(building_id: int, data: BuildingUpdate, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    return update_building(db, building_id, data)


@router.delete("/{building_id}", status_code=204)
def delete(building_id: int, db: Session = Depends(get_db), _: User = Depends(require_not_viewer)):
    delete_building(db, building_id)
