"""Add business fields to project land

Revision ID: 0004
Revises: 0003
Create Date: 2026-05-04 00:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("project_lands", sa.Column("title_reference", sa.String(length=255), nullable=True))
    op.add_column("project_lands", sa.Column("contract_scope", sa.String(length=100), nullable=True))
    op.add_column("project_lands", sa.Column("terrain_documents", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("project_lands", "terrain_documents")
    op.drop_column("project_lands", "contract_scope")
    op.drop_column("project_lands", "title_reference")
