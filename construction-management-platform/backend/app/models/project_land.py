from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class ProjectLand(Base, TimestampMixin):
    __tablename__ = "project_lands"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), unique=True, nullable=False)
    surface_area_m2 = Column(Numeric(10, 2))
    land_address = Column(String(512))
    floors_count = Column(Integer, default=0)
    has_basement = Column(Boolean, default=False)
    basement_count = Column(Integer, default=0)
    notes = Column(Text)

    project = relationship("Project", back_populates="land")
