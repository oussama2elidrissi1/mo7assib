import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.routes import (
    auth, users, projects, buildings, employees,
    attendance, tasks, resources, expenses, documents, dashboard,
    advances, salaries,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Construction Management Platform API",
    description="API for managing construction projects",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(buildings.router)
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(tasks.router)
app.include_router(resources.router)
app.include_router(expenses.router)
app.include_router(documents.router)
app.include_router(dashboard.router)
app.include_router(advances.router)
app.include_router(salaries.router)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"status": "API running"}
