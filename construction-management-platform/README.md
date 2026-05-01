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
