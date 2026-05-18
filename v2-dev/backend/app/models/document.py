import enum
from sqlalchemy import Column, Integer, String, Enum, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin, TenantMixin


class RelatedType(str, enum.Enum):
    project = "project"
    land = "land"
    resource = "resource"
    expense = "expense"
    contract = "contract"
    plan = "plan"
    invoice = "invoice"
    delivery_note = "delivery_note"
    site_photo = "site_photo"
    authorization = "authorization"


class Document(Base, TimestampMixin, TenantMixin):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    related_type = Column(Enum(RelatedType), nullable=False, default=RelatedType.project)
    related_id = Column(Integer)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(512), nullable=False)
    mime_type = Column(String(100))
    file_size = Column(Numeric(15, 2))
    uploaded_by = Column(Integer, ForeignKey("users.id"))

    project = relationship("Project", back_populates="documents")
