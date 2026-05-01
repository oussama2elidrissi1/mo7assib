import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum
from app.db.base import Base, TimestampMixin


class UserRole(str, enum.Enum):
    admin = "admin"
    project_manager = "project_manager"
    site_supervisor = "site_supervisor"
    accountant = "accountant"
    viewer = "viewer"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.viewer)
    is_active = Column(Boolean, default=True, nullable=False)
