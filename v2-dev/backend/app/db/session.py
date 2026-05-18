from fastapi import Request, HTTPException, status
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.core.jwt import decode_token

master_engine = create_engine(settings.MASTER_DATABASE_URL, pool_pre_ping=True)
MasterSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=master_engine)

_tenant_engines: dict[int, object] = {}


def get_tenant_db_url(tenant_id: int) -> str:
    base = settings.DATABASE_URL.rsplit("/", 1)[0]
    return f"{base}/construction_tenant_{tenant_id}"


def get_tenant_engine(tenant_id: int):
    if tenant_id not in _tenant_engines:
        db_url = get_tenant_db_url(tenant_id)
        _tenant_engines[tenant_id] = create_engine(db_url, pool_pre_ping=True)
    return _tenant_engines[tenant_id]


def get_master_db():
    db = MasterSessionLocal()
    try:
        yield db
    finally:
        db.close()


def _extract_tenant_id_from_request(request: Request) -> int | None:
    auth = request.headers.get("authorization", "")
    if auth.startswith("Bearer "):
        token = auth[7:]
        payload = decode_token(token)
        if payload:
            return payload.get("tenant_id")
    return None


def get_db(request: Request) -> Session:
    tenant_id = _extract_tenant_id_from_request(request)
    if tenant_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid tenant context")
    engine = get_tenant_engine(tenant_id)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
