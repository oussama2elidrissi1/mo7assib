from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.project_land import ProjectLand
from app.schemas.project_land import ProjectLandCreate
from app.services.project_service import get_project


def get_land(db: Session, project_id: int) -> ProjectLand:
    get_project(db, project_id)
    land = db.query(ProjectLand).filter(ProjectLand.project_id == project_id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land info not found")
    return land


def upsert_land(db: Session, project_id: int, data: ProjectLandCreate) -> ProjectLand:
    get_project(db, project_id)
    land = db.query(ProjectLand).filter(ProjectLand.project_id == project_id).first()
    if land:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(land, field, value)
    else:
        land = ProjectLand(project_id=project_id, **data.model_dump())
        db.add(land)
    db.commit()
    db.refresh(land)
    return land
