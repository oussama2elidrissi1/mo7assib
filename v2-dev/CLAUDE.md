# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Construction Management Platform — a French-language web app for small real-estate developers to manage construction projects. Stack:
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL + Alembic + pytest
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Axios
- **Auth**: JWT tokens stored in HTTP-only cookies (frontend), validated via Bearer header (backend)
- **Currency**: MAD (Moroccan Dirham); UI is entirely in French

## Quick Start

```bash
# Preferred: Docker Compose
./launch.sh
# Or manually:
docker compose up --build

# Local development (fallback)
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && alembic upgrade head && python seed.py && uvicorn app.main:app --reload --port 8000
cd frontend && npm install && npm run dev
```

Access points:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Default admin: `admin@example.com` / `password123`

## Build & Test Commands

**Backend:**
```bash
cd backend
source venv/bin/activate
pytest app/tests/ -v           # Run all tests
pytest app/tests/test_auth.py -v -k test_name  # Run single test
alembic upgrade head            # Apply migrations
alembic revision --autogenerate -m "description"  # Create migration
alembic downgrade -1            # Rollback one migration
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev                     # Development server
npm run build                   # Production build
npm run lint                    # ESLint
```

## Architecture

### Backend (`backend/`)

Layered architecture under `app/`:
- `api/routes/` — FastAPI HTTP handlers (thin, delegate to services)
- `services/` — Business logic and DB operations
- `schemas/` — Pydantic validation models for request/response
- `models/` — SQLAlchemy ORM models
- `db/session.py` — SQLAlchemy engine + `get_db()` dependency
- `core/config.py` — Pydantic-settings from `.env`
- `core/security.py` — Password hashing (bcrypt)
- `utils/` — File upload handling

Key patterns:
- Every route gets a DB session via `Depends(get_db)`
- Business logic lives in `services/`, never in routes
- `project_lifecycle_service.py` is the largest service; it orchestrates projects, phases, budgets, assignments, and salaries

Database driver: **psycopg3** (`postgresql+psycopg://` prefix). Do not use `psycopg2`.

### Frontend (`frontend/`)

Next.js 14 App Router structure:
- `app/` — Page routes (e.g., `app/projects/page.tsx`)
- `components/ui/` — Reusable UI primitives (Badge, Button, Card, Input, Select, Modal, ProgressBar)
- `components/tables/` — DataTable component
- `components/layout/` — Sidebar, AppShell
- `lib/api.ts` — Centralized Axios client with JWT interceptor
- `lib/auth.ts` — Login/logout/getCurrentUser
- `lib/types.ts` — TypeScript types + French/Arabic label mappings
- `middleware.ts` — Route guard (redirects to `/login` if no `access_token` cookie)

Auth flow:
- On login, `access_token` is stored in a cookie via `js-cookie` (client-side)
- Axios interceptor reads the cookie and sends `Authorization: Bearer <token>`
- On 401, cookie is removed and page redirects to `/login`
- `middleware.ts` also protects server-side navigation

**Important Next.js 14 pattern:** Client components using `useSearchParams()` must be wrapped in a `<Suspense>` boundary to avoid prerender failures during `next build`. See `app/projects/page.tsx` for the pattern.

## Environment Files

Copy from `.env.example` templates if missing:
- `backend/.env` — `DATABASE_URL`, `JWT_SECRET_KEY`, `FRONTEND_URL`, `UPLOAD_DIR`
- `frontend/.env.local` — `NEXT_PUBLIC_API_URL`

## Domain Model

Core entities (mirrored in backend models and frontend types):
- `Project` — construction site with status, price, dates
- `ProjectLand` / `Building` — real-estate details per project
- `Employee` — workforce (engineer, maâlem, worker, etc.)
- `Attendance` — daily presence with clock-in/clock-out
- `Task` — progress tracking by category and status
- `Resource` — purchases, deliveries, materials, equipment
- `Expense` — costs with automatic margin calculation
- `Document` — uploaded files (PDF, images, Office) stored locally
- `Advance` / `SalaryCalculation` — payroll management
- `ProjectPhase` / `DailySiteReport` / `MaterialDelivery` — project lifecycle tracking

Roles: `admin`, `project_manager`, `site_supervisor`, `accountant`, `viewer`

## File Uploads

Backend stores uploads in `UPLOAD_DIR` (default `./uploads`) and serves them via `app.mount("/uploads", StaticFiles(...))`. Allowed MIME types and max size are defined in `backend/app/core/config.py`. The `launch.sh` and `docker-compose.yml` mount `./backend/uploads` as a volume.

## Seeding

`backend/seed.py` creates the default admin user. It runs automatically via `launch.sh` and on first Docker boot.
