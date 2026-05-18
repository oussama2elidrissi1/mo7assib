from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, sessionmaker
from app.db.session import get_db, get_master_db, get_tenant_engine
from app.schemas.user import UserCreate, LoginRequest, LoginResponse, UserResponse
from app.services.user_service import create_user, get_user_by_email
from app.api.deps import get_current_user, require_admin
from app.models.user import User
from app.models.tenant import Tenant
from app.core.security import verify_password
from app.core.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return create_user(db, data)


@router.post("/login", response_model=LoginResponse)
def login_endpoint(data: LoginRequest, master_db: Session = Depends(get_master_db)):
    tenant = master_db.query(Tenant).filter(Tenant.slug == data.tenant_slug, Tenant.is_active == True).first()
    if not tenant:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid tenant")

    engine = get_tenant_engine(tenant.id)
    TenantSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    tenant_db = TenantSessionLocal()
    try:
        user = get_user_by_email(tenant_db, data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account inactive")
        token = create_access_token(str(user.id), tenant_id=tenant.id)
        return LoginResponse(access_token=token, user=UserResponse.model_validate(user))
    finally:
        tenant_db.close()


@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user
