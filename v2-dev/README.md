# Construction Management Platform

Plateforme de gestion de projets de construction pour promoteurs immobiliers PME.

## Stack technique

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL + Alembic
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth**: JWT (HTTP-only cookies côté frontend)
- **Stockage**: Système de fichiers local (abstrait pour migration S3)

## Démarrage rapide

### Option 1 — Docker Compose (recommandé)

```bash
cd construction-management-platform

# Copier les fichiers .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Lancer tous les services
docker compose up --build
```

Accès:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- Docs API: http://localhost:8000/docs

Compte admin par défaut:
- Email: `admin@example.com`
- Mot de passe: `password123`

---

### Option 2 — Installation locale

#### PostgreSQL

```bash
# Via Docker (recommandé)
docker run -d \
  --name construction-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=construction_db \
  -p 5432:5432 \
  postgres:16-alpine
```

#### Backend

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env selon votre configuration

# Lancer les migrations
alembic upgrade head

# Seeder l'admin par défaut
python seed.py

# Lancer le serveur
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

## Structure du projet

```
construction-management-platform/
├── backend/
│   ├── app/
│   │   ├── core/          # Config, JWT, sécurité
│   │   ├── db/            # Session SQLAlchemy
│   │   ├── models/        # Modèles SQLAlchemy
│   │   ├── schemas/       # Schémas Pydantic
│   │   ├── services/      # Logique métier
│   │   ├── api/routes/    # Endpoints FastAPI
│   │   ├── utils/         # Upload de fichiers
│   │   └── tests/         # Tests pytest
│   ├── alembic/           # Migrations DB
│   └── requirements.txt
│
├── frontend/
│   ├── app/               # Pages Next.js (App Router)
│   ├── components/        # Composants réutilisables
│   ├── lib/               # API client, auth, types
│   └── middleware.ts      # Protection des routes
│
└── docker-compose.yml
```

## Modules MVP

| Module | Description |
|--------|-------------|
| Authentification | JWT, rôles (admin, chef projet, chef chantier, comptable, viewer) |
| Chantiers | CRUD projets avec statut, prix, dates |
| Terrain | Informations foncières par projet |
| Bâtiments | Blocs/immeubles par chantier |
| Employés | Gestion de la main d'œuvre (ingénieurs, maâlems, ouvriers) |
| Pointage | Présences quotidiennes avec entrée/sortie/heures |
| Tâches | Suivi d'avancement par catégorie et statut |
| Ressources | Achats, livraisons, matériaux, équipements |
| Charges | Dépenses avec calcul automatique de la marge |
| Documents | Upload de fichiers (PDF, images, Office) |
| Dashboard | Vue synthétique avec KPIs en temps réel |

## Tests backend

```bash
cd backend
pytest app/tests/ -v
```

## API Documentation

Disponible sur http://localhost:8000/docs (Swagger UI) après démarrage du backend.

---

## Technical Notes & Troubleshooting

This section documents the fixes applied to make the platform fully operational and sustainable across environments.

### Python 3.14 compatibility

**Problem:** `psycopg2-binary==2.9.9` ships pre-compiled C extension wheels only for Python ≤ 3.13. On Python 3.14 pip falls back to compiling from source, which requires `pg_config` (part of a PostgreSQL installation). If PostgreSQL is not installed locally the build fails with:

```
Error: pg_config executable not found.
ERROR: Failed to build 'psycopg2-binary'
```

**Fix:** `psycopg2-binary` was replaced with **`psycopg[binary]>=3.1`** (psycopg3). psycopg3 ships native wheels for Python 3.12–3.14+ (arm64 and x86-64) so no local PostgreSQL headers are needed.  
The SQLAlchemy connection string prefix was updated from `postgresql://` to **`postgresql+psycopg://`** in every location where the URL is defined:

| File | What changed |
|------|-------------|
| `backend/requirements.txt` | `psycopg2-binary==2.9.9` → `psycopg[binary]>=3.1` |
| `backend/.env` and `backend/.env.example` | URL prefix `postgresql://` → `postgresql+psycopg://` |
| `backend/app/core/config.py` | Default `DATABASE_URL` prefix updated |
| `backend/alembic.ini` | Fallback URL prefix updated |
| `docker-compose.yml` | `DATABASE_URL` in backend environment updated |

**Why `pydantic` pins were loosened:** `pydantic-core==2.9.2` also lacks Python 3.14 wheels and requires a Rust toolchain to compile. The requirements now use `pydantic>=2.9.2` so pip resolves to the latest release (currently 2.13.x) which ships 3.14 wheels.

### PostgreSQL on macOS without Docker

When Docker is not running, the script installs and starts PostgreSQL via Homebrew:

```bash
brew install postgresql@16
brew services start postgresql@16
```

The script then creates the `postgres` superuser role and the `construction_db` database if they do not exist.  
You only need to do this once — subsequent `./launch.sh` runs will find the service already running.

### launch.sh — what it does

```
./launch.sh
```

1. **Copies `.env` files** from the `.example` templates if they do not already exist.
2. **Tries to start Docker Desktop** if it is installed but its daemon is not running (macOS only, waits up to 60 s).
3. **Docker path (preferred):** If Docker is available, runs `docker compose up --build -d` which starts PostgreSQL, the FastAPI backend, and the Next.js frontend in isolated containers.  The backend automatically runs `alembic upgrade head` and `python seed.py` on first boot.
4. **Local path (fallback):** If Docker is unavailable:
   - Locates Homebrew PostgreSQL and starts it, creating the required role and database.
   - Falls back to a Docker-only PostgreSQL container if brew PostgreSQL is not found.
   - Creates/resets the Python virtual environment if the Python version changed.
   - Installs Python dependencies (`pip install -r requirements.txt`).
   - Runs `alembic upgrade head` and `python seed.py`.
   - Starts `uvicorn` (port 8000) and `npm run dev` (port 3000) as background processes.
   - Traps `Ctrl+C` to cleanly shut down both processes.

### Frontend TypeScript fixes

Three missing/mismatched type exports were repaired in `frontend/lib/types.ts`:

| Issue | Fix |
|-------|-----|
| `ADVANCE_STATUS_LABELS` not exported | Added constant mapping `AdvanceStatus` → Arabic labels |
| `Document` type not exported | Added `export type Document = ProjectDocument` alias |
| `ProjectDocument` missing `mime_type` / `file_size` | Added both as optional fields |
| `ProjectSalaryRow` missing required `id` field for `DataTable` | Added `id: number`; mapped from `salary_id` at fetch time in the project detail page |

### Next.js 14 `useSearchParams` fix

**Problem:** In Next.js 14 App Router, calling `useSearchParams()` in a client component without a `<Suspense>` boundary causes a pre-render failure during `next build`:

```
Error occurred prerendering page "/projects"
```

**Fix:** The `ProjectsPage` component in `app/projects/page.tsx` was split into a thin outer shell that renders the real content inside `<Suspense>`:

```tsx
export default function ProjectsPage() {
  return <Suspense><ProjectsContent /></Suspense>;
}
function ProjectsContent() {
  const params = useSearchParams(); // safe inside Suspense
  ...
}
```

### Default credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `password123` |

> Change the admin password and set a strong `JWT_SECRET_KEY` before deploying to production.
