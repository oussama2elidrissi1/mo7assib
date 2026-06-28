#!/usr/bin/env bash
# Render start script for mo7assib backend.
#
# 1. Run Alembic migrations (idempotent).
# 2. Seed demo data (idempotent — skips if any project exists).
# 3. Rewrite DATABASE_URL scheme from postgresql:// to postgresql+psycopg://
#    so SQLAlchemy uses the psycopg3 driver.
# 4. Start Uvicorn on Render's $PORT.

set -euo pipefail

echo "[start.sh] Running alembic upgrade head"
alembic upgrade head

echo "[start.sh] Running seed"
python seed.py

# Render's fromDatabase.connectionString returns postgresql:// but SQLAlchemy
# needs the +psycopg scheme to use psycopg3.
export DATABASE_URL="${DATABASE_URL/postgresql:\/\//postgresql+psycopg:\/\/}"
echo "[start.sh] DATABASE_URL scheme rewritten for SQLAlchemy/psycopg3"

echo "[start.sh] Starting uvicorn on port ${PORT:-8000}"
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"