"""Add advances, salary_calculations tables + extra employee/project fields

Revision ID: 0002
Revises: 0001
Create Date: 2026-05-04 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new columns to employees
    op.add_column("employees", sa.Column("cin", sa.String(20), nullable=True))
    op.add_column("employees", sa.Column("job_title", sa.String(100), nullable=True))
    op.add_column("employees", sa.Column("hourly_wage", sa.Numeric(10, 2), nullable=True, server_default="0"))
    op.add_column("employees", sa.Column("work_hours_per_day", sa.Numeric(4, 1), nullable=True, server_default="8"))

    # Add new columns to projects
    op.add_column("projects", sa.Column("estimated_budget", sa.Numeric(15, 2), nullable=True, server_default="0"))
    op.add_column("projects", sa.Column("description", sa.String(1024), nullable=True))

    # Create advances table
    op.create_table(
        "advances",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("employee_id", sa.Integer(), sa.ForeignKey("employees.id", ondelete="CASCADE"), nullable=False),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("requested_amount", sa.Numeric(15, 2), nullable=False),
        sa.Column("approved_amount", sa.Numeric(15, 2), nullable=True),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("status", sa.Enum("pending", "approved", "rejected", name="advancestatus"), nullable=False),
        sa.Column("approved_by", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("advance_date", sa.Date(), nullable=False),
        sa.Column("month", sa.String(7), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_advances_id", "advances", ["id"])
    op.create_index("ix_advances_employee_id", "advances", ["employee_id"])
    op.create_index("ix_advances_project_id", "advances", ["project_id"])

    # Create salary_calculations table
    op.create_table(
        "salary_calculations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("employee_id", sa.Integer(), sa.ForeignKey("employees.id", ondelete="CASCADE"), nullable=False),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("month", sa.String(7), nullable=False),
        sa.Column("worked_days", sa.Numeric(5, 2), nullable=True, server_default="0"),
        sa.Column("base_salary", sa.Numeric(15, 2), nullable=True, server_default="0"),
        sa.Column("overtime_hours", sa.Numeric(5, 2), nullable=True, server_default="0"),
        sa.Column("overtime_amount", sa.Numeric(15, 2), nullable=True, server_default="0"),
        sa.Column("advances_total", sa.Numeric(15, 2), nullable=True, server_default="0"),
        sa.Column("deductions", sa.Numeric(15, 2), nullable=True, server_default="0"),
        sa.Column("net_salary", sa.Numeric(15, 2), nullable=True, server_default="0"),
        sa.Column("paid_amount", sa.Numeric(15, 2), nullable=True, server_default="0"),
        sa.Column("remaining_amount", sa.Numeric(15, 2), nullable=True, server_default="0"),
        sa.Column("payment_status", sa.Enum("unpaid", "partial", "paid", name="paymentstatus"), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("employee_id", "project_id", "month", name="uq_salary_emp_proj_month"),
    )
    op.create_index("ix_salary_calculations_id", "salary_calculations", ["id"])
    op.create_index("ix_salary_calculations_employee_id", "salary_calculations", ["employee_id"])
    op.create_index("ix_salary_calculations_project_id", "salary_calculations", ["project_id"])


def downgrade() -> None:
    op.drop_table("salary_calculations")
    op.drop_table("advances")
    op.drop_column("projects", "description")
    op.drop_column("projects", "estimated_budget")
    op.drop_column("employees", "work_hours_per_day")
    op.drop_column("employees", "hourly_wage")
    op.drop_column("employees", "job_title")
    op.drop_column("employees", "cin")
