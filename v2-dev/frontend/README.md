# Frontend — Next.js

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL du backend FastAPI |

## Architecture

```
app/              # Pages (App Router)
components/
  ui/             # Badge, Button, Card, Input, Select, Modal, ProgressBar
  layout/         # Sidebar, AppShell
  tables/         # DataTable
lib/
  api.ts          # Client Axios centralisé
  auth.ts         # Login/logout/getCurrentUser
  types.ts        # Types TypeScript + labels FR
middleware.ts     # Protection des routes (redirect → /login)
```

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Connexion |
| `/dashboard` | Tableau de bord |
| `/projects` | Liste des chantiers |
| `/projects/new` | Nouveau chantier |
| `/projects/[id]` | Détail (10 onglets) |
| `/projects/[id]/edit` | Modifier |
| `/employees` | Employés par chantier |
| `/attendance` | Pointage quotidien |
| `/tasks` | Tâches |
| `/resources` | Achats & Ressources |
| `/expenses` | Charges |
| `/documents` | Documents |

## Conventions

- Toute communication avec la DB passe par FastAPI (jamais en direct)
- Le token JWT est stocké dans un cookie `access_token`
- L'interface est en français, devise MAD
