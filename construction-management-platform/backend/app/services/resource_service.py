from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.resource import Resource
from app.schemas.resource import ResourceCreate, ResourceUpdate
from app.services.project_service import get_project


def get_resources(db: Session, project_id: int) -> list[Resource]:
    get_project(db, project_id)
    return db.query(Resource).filter(Resource.project_id == project_id).all()


def get_resource(db: Session, resource_id: int) -> Resource:
    r = db.query(Resource).filter(Resource.id == resource_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")
    return r


def create_resource(db: Session, data: ResourceCreate) -> Resource:
    get_project(db, data.project_id)
    r = Resource(**data.model_dump())
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


def update_resource(db: Session, resource_id: int, data: ResourceUpdate) -> Resource:
    r = get_resource(db, resource_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(r, field, value)
    db.commit()
    db.refresh(r)
    return r


def delete_resource(db: Session, resource_id: int) -> None:
    r = get_resource(db, resource_id)
    db.delete(r)
    db.commit()
