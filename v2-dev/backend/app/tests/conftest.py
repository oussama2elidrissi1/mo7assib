import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.base import Base
from app.db.session import get_db, get_master_db
from app.models.user import User, UserRole
from app.models.tenant import Tenant
from app.core.security import hash_password
from app.core.jwt import create_access_token


@pytest.fixture(scope="function")
def master_db():
    engine = create_engine("sqlite:///./test_master.db", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    tenant = Tenant(id=1, name="Test", slug="test")
    session.add(tenant)
    session.commit()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db():
    engine = create_engine("sqlite:///./test_tenant.db", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db, master_db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    def override_get_master_db():
        try:
            yield master_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_master_db] = override_get_master_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def admin_user(db):
    user = User(
        name="Admin",
        email="admin@test.com",
        password_hash=hash_password("password123"),
        role=UserRole.admin,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def admin_token(admin_user):
    return create_access_token(str(admin_user.id), tenant_id=1)


@pytest.fixture
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}
