from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base, TimestampMixin


class Tenant(Base, TimestampMixin):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    database_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
