from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from app.core.config import settings


def create_access_token(subject: str, tenant_id: int | None = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "exp": expire}
    if tenant_id is not None:
        payload["tenant_id"] = tenant_id
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return {"sub": payload.get("sub"), "tenant_id": payload.get("tenant_id")}
    except JWTError:
        return None
