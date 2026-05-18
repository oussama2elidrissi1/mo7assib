from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Building(Base, TimestampMixin):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    surface_area_m2 = Column(Numeric(10, 2))
    number_of_floors = Column(Integer, default=0)
    number_of_apartments = Column(Integer, default=0)
    notes = Column(Text)

    project = relationship("Project", back_populates="buildings")
