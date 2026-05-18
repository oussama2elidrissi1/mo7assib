#!/usr/bin/env bash
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[+]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
error() { echo -e "${RED}[x]${NC} $*"; exit 1; }

# ── env files ────────────────────────────────────────────────────────────────
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  warn "Created backend/.env from example — edit it if needed."
fi
if [ ! -f frontend/.env.local ]; then
  cp frontend/.env.example frontend/.env.local
  warn "Created frontend/.env.local from example — edit it if needed."
fi

# ── Try to start Docker Desktop if installed but daemon not running ───────────
if command -v docker &>/dev/null && ! docker info &>/dev/null 2>&1; then
  warn "Docker installed but daemon is not running."
  if [ -d "/Applications/Docker.app" ]; then
    info "Starting Docker Desktop — waiting up to 60 s…"
    open -a Docker
    for i in $(seq 1 30); do
      sleep 2
      docker info &>/dev/null 2>&1 && break
    done
    docker info &>/dev/null 2>&1 || warn "Docker Desktop did not start in time — falling back to local mode."
  fi
fi

# ── Docker path ───────────────────────────────────────────────────────────────
if command -v docker &>/dev/null && docker info &>/dev/null 2>&1; then
  info "Docker detected — using Docker Compose (recommended)."

  if docker compose version &>/dev/null 2>&1; then
    COMPOSE="docker compose"
  elif docker-compose version &>/dev/null 2>&1; then
    COMPOSE="docker-compose"
  else
    error "docker compose plugin not found. Install Docker Desktop or the compose plugin."
  fi

  info "Building and starting all services…"
  $COMPOSE up --build -d

  echo ""
  info "All services are up:"
  echo "   Frontend  → http://localhost:3000"
  echo "   API       → http://localhost:8000"
  echo "   API Docs  → http://localhost:8000/docs"
  echo ""
  echo "   5 tenants available:"
  echo "     atlas         → admin1@example.com / password123"
  echo "     horizon       → admin2@example.com / password123"
  echo "     constructplus → admin3@example.com / password123"
  echo "     geniecivil    → admin4@example.com / password123"
  echo "     nord          → admin5@example.com / password123"
  echo ""
  info "Tailing logs (Ctrl+C to stop following — services keep running):"
  $COMPOSE logs -f

# ── Local path ────────────────────────────────────────────────────────────────
else
  warn "Docker not available — falling back to local installation."

  command -v python3 &>/dev/null || error "python3 is required."
  command -v node    &>/dev/null || error "node is required."
  command -v npm     &>/dev/null || error "npm is required."

  # ── PostgreSQL ──────────────────────────────────────────────────────────────
  PG_RUNNING=false

  # Check Homebrew PostgreSQL (preferred for local dev on macOS)
  BREW_PG_BIN=""
  for dir in /opt/homebrew/opt/postgresql@16/bin /usr/local/opt/postgresql@16/bin \
             /opt/homebrew/opt/postgresql@15/bin /usr/local/opt/postgresql@15/bin \
             /opt/homebrew/opt/postgresql/bin    /usr/local/opt/postgresql/bin; do
    if [ -x "$dir/pg_isready" ]; then
      BREW_PG_BIN="$dir"
      break
    fi
  done

  if [ -n "$BREW_PG_BIN" ]; then
    if "$BREW_PG_BIN/pg_isready" -q 2>/dev/null; then
      info "PostgreSQL (Homebrew) already running."
      PG_RUNNING=true
    else
      info "Starting Homebrew PostgreSQL…"
      # Detect which formula is installed and start it
      for formula in postgresql@16 postgresql@15 postgresql; do
        if brew list "$formula" &>/dev/null 2>&1; then
          brew services start "$formula" 2>/dev/null || true
          sleep 2
          break
        fi
      done
      if "$BREW_PG_BIN/pg_isready" -q 2>/dev/null; then
        PG_RUNNING=true
        # Ensure the postgres superuser role exists
        if ! "$BREW_PG_BIN/psql" -U postgres -d postgres -c "SELECT 1;" &>/dev/null 2>&1; then
          info "Creating 'postgres' superuser role…"
          "$BREW_PG_BIN/psql" -d postgres -c \
            "CREATE ROLE postgres WITH SUPERUSER LOGIN PASSWORD 'postgres';" 2>/dev/null || true
        fi
      fi
    fi
  fi

  # Docker-based PostgreSQL (fallback when brew PG not installed)
  if [ "$PG_RUNNING" = false ] && command -v docker &>/dev/null; then
    if ! docker ps --filter "name=construction-db" --filter "status=running" 2>/dev/null | grep -q construction-db; then
      info "Starting PostgreSQL via Docker…"
      docker run -d \
        --name construction-db \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=construction_master \
        -p 5432:5432 \
        postgres:16-alpine 2>/dev/null || docker start construction-db 2>/dev/null || true
      sleep 4
    else
      info "PostgreSQL Docker container already running."
    fi
    PG_RUNNING=true
  fi

  if [ "$PG_RUNNING" = false ]; then
    warn "No PostgreSQL found. Install with: brew install postgresql@16"
    warn "Then re-run this script."
    warn "Continuing — the backend will fail if the DB is not reachable."
  fi

  # ── Backend ─────────────────────────────────────────────────────────────────
  info "Setting up backend…"
  cd "$PROJECT_DIR/backend"

  if [ ! -d venv ]; then
    python3 -m venv venv
  fi

  # Re-create venv if it was built for a different Python version
  VENV_PYTHON="$(venv/bin/python3 --version 2>&1 | awk '{print $2}')"
  SYS_PYTHON="$(python3 --version 2>&1 | awk '{print $2}')"
  if [ "$VENV_PYTHON" != "$SYS_PYTHON" ]; then
    warn "venv Python ($VENV_PYTHON) differs from system ($SYS_PYTHON) — rebuilding venv…"
    python3 -m venv venv --clear
  fi

  source venv/bin/activate
  pip install -q --upgrade pip
  pip install -q -r requirements.txt
  python migrate_all.py
  python seed.py
  uvicorn app.main:app --reload --port 8000 &
  BACKEND_PID=$!
  deactivate
  cd "$PROJECT_DIR"

  # ── Frontend ─────────────────────────────────────────────────────────────────
  info "Setting up frontend…"
  cd "$PROJECT_DIR/frontend"
  npm install --silent
  npm run dev &
  FRONTEND_PID=$!
  cd "$PROJECT_DIR"

  echo ""
  info "Services started:"
  echo "   Frontend  → http://localhost:3000"
  echo "   API       → http://localhost:8000"
  echo "   API Docs  → http://localhost:8000/docs"
  echo ""
  echo "   5 tenants available:"
  echo "     atlas         → admin1@example.com / password123"
  echo "     horizon       → admin2@example.com / password123"
  echo "     constructplus → admin3@example.com / password123"
  echo "     geniecivil    → admin4@example.com / password123"
  echo "     nord          → admin5@example.com / password123"
  echo ""
  info "Press Ctrl+C to stop all services."

  cleanup() {
    info "Shutting down…"
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    info "Stopped."
  }
  trap cleanup INT TERM
  wait
fi
