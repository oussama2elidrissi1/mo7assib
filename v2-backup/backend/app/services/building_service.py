from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.building import Building
from app.schemas.building import BuildingCreate, BuildingUpdate
from app.services.project_service import get_project


def get_buildings(db: Session, project_id: int) -> list[Building]:
    get_project(db, project_id)
    return db.query(Building).filter(Building.project_id == project_id).all()


def get_building(db: Session, building_id: int) -> Building:
    b = db.query(Building).filter(Building.id == building_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Building not found")
    return b


def create_building(db: Session, data: BuildingCreate) -> Building:
    get_project(db, data.project_id)
    b = Building(**data.model_dump())
    db.add(b)
    db.commit()
    db.refresh(b)
    return b


def update_building(db: Session, building_id: int, data: BuildingUpdate) -> Building:
    b = get_building(db, building_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(b, field, value)
    db.commit()
    db.refresh(b)
    return b


def delete_building(db: Session, building_id: int) -> None:
    b = get_building(db, building_id)
    db.delete(b)
    db.commit()
