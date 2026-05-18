"""Run Alembic migrations on master + all tenant databases."""

import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.db.create_databases import create_databases


def migrate_all():
    create_databases()

    urls = [settings.MASTER_DATABASE_URL]
    base = settings.DATABASE_URL.rsplit("/", 1)[0]
    urls += [f"{base}/construction_tenant_{i}" for i in range(1, 6)]

    for url in urls:
        print(f"\nMigrating {url} ...")
        env = os.environ.copy()
        env["DATABASE_URL"] = url
        subprocess.run(["alembic", "upgrade", "head"], env=env, check=True)

    print("\nAll migrations completed.")


if __name__ == "__main__":
    migrate_all()
