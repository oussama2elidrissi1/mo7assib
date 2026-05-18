# Backend — FastAPI

## Installation

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Éditer .env
alembic upgrade head
python seed.py
uvicorn app.main:app --reload
```

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://postgres:postgres@localhost:5432/construction_db` |
| `JWT_SECRET_KEY` | Clé secrète JWT | — |
| `JWT_ALGORITHM` | Algorithme JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Durée token | `1440` |
| `UPLOAD_DIR` | Dossier uploads | `uploads` |
| `FRONTEND_URL` | URL du frontend (CORS) | `http://localhost:3000` |

## Architecture

```
app/
├── core/       # Configuration, JWT, hashage
├── db/         # Session SQLAlchemy
├── models/     # Modèles ORM
├── schemas/    # Validation Pydantic
├── services/   # Logique métier (pas dans les routes)
├── api/routes/ # Handlers HTTP
└── utils/      # Upload fichiers
```

## Tests

```bash
pytest app/tests/ -v
```

## Migrations

```bash
# Créer une migration
alembic revision --autogenerate -m "description"

# Appliquer
alembic upgrade head

# Rollback
alembic downgrade -1
```
