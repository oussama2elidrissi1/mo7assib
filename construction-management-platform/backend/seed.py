"""Seed default admin user. Run: python seed.py"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.core.security import hash_password


def seed():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "admin@example.com").first()
        if existing:
            print("Admin user already exists.")
            return
        admin = User(
            name="Admin",
            email="admin@example.com",
            password_hash=hash_password("password123"),
            role=UserRole.admin,
            is_active=True,
        )
        db.add(admin)
        db.commit()
        print("Admin user created: admin@example.com / password123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
