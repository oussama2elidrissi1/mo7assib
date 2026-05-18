"""Add project lifecycle entities and richer project fields

Revision ID: 0003
Revises: 0002
Create Date: 2026-05-04 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE projectstatus ADD VALUE IF NOT EXISTS 'draft'")
    op.execute("ALTER TYPE projectstatus ADD VALUE IF NOT EXISTS 'archived'")
    op.execute("ALTER TYPE relatedtype ADD VALUE IF NOT EXISTS 'contract'")
    op.execute("ALTER TYPE relatedtype ADD VALUE IF NOT EXISTS 'plan'")
    op.execute("ALTER TYPE relatedtype ADD VALUE IF NOT EXISTS 'invoice'")
    op.execute("ALTER TYPE relatedtype ADD VALUE IF NOT EXISTS 'delivery_note'")
    op.execute("ALTER TYPE relatedtype ADD VALUE IF NOT EXISTS 'site_photo'")
    op.execute("ALTER TYPE relatedtype ADD VALUE IF NOT EXISTS 'authorization'")

    op.add_column("projects", sa.Column("city", sa.String(120), nullable=True))
    op.add_column("projects", sa.Column("current_progress", sa.Numeric(5, 2), nullable=True, server_default="0"))
    op.add_column("attendance", sa.Column("overtime_hours", sa.Numeric(5, 2), nullable=True, server_default="0"))
    op.add_column("attendance", sa.Column("supervisor_note", sa.Text(), nullable=True))
    op.add_column("attendance", sa.Column("tasks_completed", sa.Text(), nullable=True))
    op.add_column("attendance", sa.Column("photo_count", sa.Integer(), nullable=True, server_default="0"))
    op.add_column("expenses", sa.Column("is_validated", sa.Boolean(), nullable=True, server_default=sa.text("false")))
    op.add_column("expenses", sa.Column("validated_by", sa.Integer(), nullable=True))
    op.create_foreign_key("fk_expenses_validated_by_users", "expenses", "users", ["validated_by"], ["id"])

    op.create_table(
        "project_budgets",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("labor_budget", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("materials_budget", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("equipment_budget", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("other_budget", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("estimated_margin", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("budget_total", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("project_id"),
    )
    op.create_index("ix_project_budgets_id", "project_budgets", ["id"])
    op.create_index("ix_project_budgets_project_id", "project_budgets", ["project_id"])

    op.create_table(
        "project_phases",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("phase_key", sa.Enum("earthwork", "foundation", "structure", "electricity", "plumbing", "plaster", "tiling", "painting", "finishing", "delivery", name="projectphasekey"), nullable=False),
        sa.Column("sequence", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.Enum("pending", "in_progress", "completed", "delayed", name="projectphasestatus"), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("progress_percentage", sa.Numeric(5, 2), nullable=False, server_default="0"),
        sa.Column("budget_planned", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("actual_cost", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_project_phases_id", "project_phases", ["id"])
    op.create_index("ix_project_phases_project_id", "project_phases", ["project_id"])

    op.create_table(
        "project_assignments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("employee_id", sa.Integer(), sa.ForeignKey("employees.id", ondelete="CASCADE"), nullable=False),
        sa.Column("assignment_role", sa.Enum("project_manager", "site_supervisor", "maalem", "worker", "accountant", "other", name="assignmentrole"), nullable=False),
        sa.Column("daily_salary", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("work_hours_per_day", sa.Numeric(4, 1), nullable=False, server_default="8"),
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_project_assignments_id", "project_assignments", ["id"])
    op.create_index("ix_project_assignments_project_id", "project_assignments", ["project_id"])
    op.create_index("ix_project_assignments_employee_id", "project_assignments", ["employee_id"])

    op.create_table(
        "daily_site_reports",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("report_date", sa.Date(), nullable=False),
        sa.Column("attendance_completed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("completed_tasks", sa.Text(), nullable=True),
        sa.Column("supervisor_note", sa.Text(), nullable=True),
        sa.Column("photo_urls", sa.Text(), nullable=True),
        sa.Column("deliveries_received", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("expenses_added", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_daily_site_reports_id", "daily_site_reports", ["id"])
    op.create_index("ix_daily_site_reports_project_id", "daily_site_reports", ["project_id"])
    op.create_index("ix_daily_site_reports_report_date", "daily_site_reports", ["report_date"])

    op.create_table(
        "suppliers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("city", sa.String(120), nullable=True),
        sa.Column("specialty", sa.String(120), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_suppliers_id", "suppliers", ["id"])

    op.create_table(
        "material_deliveries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("supplier_id", sa.Integer(), sa.ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("material_name", sa.String(255), nullable=False),
        sa.Column("quantity", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("unit", sa.String(30), nullable=False, server_default="u"),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("total_price", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("delivery_date", sa.Date(), nullable=False),
        sa.Column("status", sa.Enum("ordered", "delivered", "consumed", name="deliverystatus"), nullable=False),
        sa.Column("stock_quantity", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_material_deliveries_id", "material_deliveries", ["id"])
    op.create_index("ix_material_deliveries_project_id", "material_deliveries", ["project_id"])
    op.create_index("ix_material_deliveries_supplier_id", "material_deliveries", ["supplier_id"])

    op.create_table(
        "salary_payments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("salary_calculation_id", sa.Integer(), sa.ForeignKey("salary_calculations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("amount", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("payment_date", sa.Date(), nullable=False),
        sa.Column("payment_method", sa.String(50), nullable=False, server_default="cash"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_salary_payments_id", "salary_payments", ["id"])
    op.create_index("ix_salary_payments_salary_calculation_id", "salary_payments", ["salary_calculation_id"])


def downgrade() -> None:
    op.drop_table("salary_payments")
    op.drop_table("material_deliveries")
    op.drop_table("suppliers")
    op.drop_table("daily_site_reports")
    op.drop_table("project_assignments")
    op.drop_table("project_phases")
    op.drop_table("project_budgets")
    op.drop_constraint("fk_expenses_validated_by_users", "expenses", type_="foreignkey")
    op.drop_column("expenses", "validated_by")
    op.drop_column("expenses", "is_validated")
    op.drop_column("attendance", "photo_count")
    op.drop_column("attendance", "tasks_completed")
    op.drop_column("attendance", "supervisor_note")
    op.drop_column("attendance", "overtime_hours")
    op.drop_column("projects", "current_progress")
    op.drop_column("projects", "city")
