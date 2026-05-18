import enum
from sqlalchemy import Column, Integer, String, Enum, Date, Numeric, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin, TenantMixin


class ResourceType(str, enum.Enum):
    purchase = "purchase"
    delivery = "delivery"
    material = "material"
    equipment = "equipment"


class Resource(Base, TimestampMixin, TenantMixin):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(Enum(ResourceType), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    amount = Column(Numeric(15, 2), default=0)
    supplier_name = Column(String(255))
    supplier_phone = Column(String(50))
    purchase_date = Column(Date)
    file_url = Column(String(512))

    project = relationship("Project", back_populates="resources")
