import psycopg
from app.core.config import settings


def get_admin_conninfo() -> str:
    base = settings.DATABASE_URL.rsplit("/", 1)[0]
    return base.replace("postgresql+psycopg://", "postgresql://") + "/postgres"


def create_databases():
    conninfo = get_admin_conninfo()
    dbs = ["construction_master"] + [f"construction_tenant_{i}" for i in range(1, 6)]

    with psycopg.connect(conninfo) as conn:
        conn.autocommit = True
        with conn.cursor() as cur:
            for db_name in dbs:
                cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
                if not cur.fetchone():
                    cur.execute(f"CREATE DATABASE {db_name}")
                    print(f"Created database {db_name}")
                else:
                    print(f"Database {db_name} already exists")
