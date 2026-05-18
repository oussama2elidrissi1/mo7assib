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

# ── Docker Compose ────────────────────────────────────────────────────────────
if [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
  if command -v docker &>/dev/null && docker info &>/dev/null 2>&1; then
    if docker compose version &>/dev/null 2>&1; then
      COMPOSE="docker compose"
    elif docker-compose version &>/dev/null 2>&1; then
      COMPOSE="docker-compose"
    else
      warn "docker compose plugin not found. Skipping Docker Compose shutdown."
      COMPOSE=""
    fi

    if [ -n "$COMPOSE" ]; then
      if $COMPOSE ps -q &>/dev/null | grep -q .; then
        info "Stopping Docker Compose services…"
        $COMPOSE down
      else
        warn "Docker Compose services are not running."
      fi
    fi
  else
    warn "Docker is not running. Skipping Docker Compose shutdown."
  fi
else
  warn "docker-compose.yml not found. Skipping Docker Compose shutdown."
fi

# ── Local backend / frontend ──────────────────────────────────────────────────
kill_port() {
  local port=$1
  local pid
  pid=$(lsof -t -i:"$port" 2>/dev/null || true)
  if [ -n "$pid" ]; then
    info "Killing process on port $port (PID: $pid)…"
    kill -TERM "$pid" 2>/dev/null || true
    sleep 1
    # Force kill if still running
    if kill -0 "$pid" 2>/dev/null; then
      kill -KILL "$pid" 2>/dev/null || true
    fi
  else
    warn "No process found on port $port."
  fi
}

kill_port 8000
kill_port 3000

# ── Local PostgreSQL Docker container ─────────────────────────────────────────
if command -v docker &>/dev/null && docker info &>/dev/null 2>&1; then
  if docker ps -a --filter "name=construction-db" --format '{{.Names}}' | grep -q '^construction-db$'; then
    info "Stopping construction-db Docker container…"
    docker stop construction-db 2>/dev/null || true
  else
    warn "construction-db Docker container not found."
  fi
fi

info "Done."
