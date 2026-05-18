from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field
from app.models.document import RelatedType
from app.models.project_cycle import (
    AssignmentRole,
    DeliveryStatus,
    ProjectPhaseKey,
    ProjectPhaseStatus,
)
from app.models.salary import PaymentStatus


class ProjectBudgetBase(BaseModel):
    labor_budget: Decimal = Decimal("0")
    materials_budget: Decimal = Decimal("0")
    equipment_budget: Decimal = Decimal("0")
    other_budget: Decimal = Decimal("0")


class ProjectBudgetCreate(ProjectBudgetBase):
    pass


class ProjectBudgetResponse(ProjectBudgetBase):
    id: int
    project_id: int
    estimated_margin: Decimal
    budget_total: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectPhaseCreate(BaseModel):
    name: str
    phase_key: ProjectPhaseKey
    sequence: int
    status: ProjectPhaseStatus = ProjectPhaseStatus.pending
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    progress_percentage: Decimal = Decimal("0")
    budget_planned: Decimal = Decimal("0")
    actual_cost: Decimal = Decimal("0")
    notes: Optional[str] = None


class ProjectPhaseResponse(ProjectPhaseCreate):
    id: int
    project_id: int
    is_delayed: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectAssignmentCreate(BaseModel):
    employee_id: int
    assignment_role: AssignmentRole
    daily_salary: Decimal = Decimal("0")
    work_hours_per_day: Decimal = Decimal("8")
    is_primary: bool = False


class ProjectAssignmentResponse(ProjectAssignmentCreate):
    id: int
    project_id: int
    employee_name: str
    employee_phone: Optional[str] = None
    presence_today: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DailySiteReportCreate(BaseModel):
    report_date: date
    attendance_completed: bool = False
    completed_tasks: Optional[str] = None
    supervisor_note: Optional[str] = None
    photo_urls: Optional[str] = None
    deliveries_received: int = 0
    expenses_added: int = 0


class DailySiteReportResponse(DailySiteReportCreate):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SupplierResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    city: Optional[str] = None
    specialty: Optional[str] = None

    class Config:
        from_attributes = True


class MaterialDeliveryResponse(BaseModel):
    id: int
    project_id: int
    supplier_id: Optional[int] = None
    title: str
    material_name: str
    quantity: Decimal
    unit: str
    unit_price: Decimal
    total_price: Decimal
    delivery_date: date
    status: DeliveryStatus
    stock_quantity: Decimal
    notes: Optional[str] = None
    supplier: Optional[SupplierResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SalaryPaymentResponse(BaseModel):
    id: int
    salary_calculation_id: int
    amount: Decimal
    payment_date: date
    payment_method: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class ProjectAlert(BaseModel):
    level: str
    code: str
    title: str
    description: str


class ProjectOverviewResponse(BaseModel):
    id: int
    name: str
    city: Optional[str] = None
    location: str
    address: Optional[str] = None
    status: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    estimated_end_date: Optional[date] = None
    agreed_price: Decimal
    budget_prevu: Decimal
    cout_reel: Decimal
    marge_estimee: Decimal
    marge_reelle: Decimal
    taux_avancement: Decimal
    taux_depassement_budget: Decimal
    prochaine_phase: Optional[str] = None
    chef_chantier: Optional[str] = None
    project_manager: Optional[str] = None
    team_count: int = 0
    present_today_count: int = 0
    absent_today_count: int = 0
    documents_count: int = 0
    pending_expenses_count: int = 0
    validated_deliveries_count: int = 0
    delayed_phases_count: int = 0
    budget: Optional[ProjectBudgetResponse] = None
    alerts: list[ProjectAlert] = Field(default_factory=list)


class ProjectSalaryEmployeeSummary(BaseModel):
    salary_id: int
    employee_id: int
    employee_name: str
    month: str
    worked_days: Decimal
    gross_salary: Decimal
    overtime_amount: Decimal
    advances_total: Decimal
    deductions: Decimal
    net_salary: Decimal
    paid_amount: Decimal
    remaining_amount: Decimal
    payment_status: PaymentStatus
    payments: list[SalaryPaymentResponse] = Field(default_factory=list)


class ProjectSalarySummaryResponse(BaseModel):
    project_id: int
    month: str
    gross_total: Decimal
    overtime_total: Decimal
    advances_total: Decimal
    net_total: Decimal
    paid_total: Decimal
    remaining_total: Decimal
    unpaid_count: int
    salaries: list[ProjectSalaryEmployeeSummary] = Field(default_factory=list)


class ProjectFinancialSummaryV2(BaseModel):
    project_id: int
    agreed_price: Decimal
    budget_prevu: Decimal
    cout_reel: Decimal
    depenses_total: Decimal
    achats_valides_total: Decimal
    salaires_total: Decimal
    marge_estimee: Decimal
    marge_reelle: Decimal
    taux_depassement_budget: Decimal
    expenses_breakdown: dict[str, Decimal]
    top_cost_items: list[dict[str, str | Decimal]]
    manual_expenses: Decimal
    labor_cost: Decimal
    total_expenses: Decimal
    estimated_margin: Decimal


class DashboardProjectCard(BaseModel):
    id: int
    name: str
    city: Optional[str] = None
    status: str
    progress: Decimal
    budget_prevu: Decimal
    cout_reel: Decimal
    marge_estimee: Decimal
    prochaine_phase: Optional[str] = None
    chef_chantier: Optional[str] = None


class DashboardActivityItem(BaseModel):
    label: str
    value: str


class DashboardFinanceQuick(BaseModel):
    budget_vs_actual: list[dict[str, Decimal | str]]
    expenses_distribution: list[dict[str, Decimal | str]]
    top_cost_projects: list[DashboardProjectCard]


class DashboardSummaryResponse(BaseModel):
    greeting_name: str
    active_projects: int
    delayed_projects: int
    budget_total_engaged: Decimal
    cout_reel_total: Decimal
    marge_estimee_total: Decimal
    depenses_mois: Decimal
    salaires_a_payer: Decimal
    employes_presents_aujourdhui: int
    alerts: list[ProjectAlert] = Field(default_factory=list)
    active_site_cards: list[DashboardProjectCard] = Field(default_factory=list)
    today_activity: list[DashboardActivityItem] = Field(default_factory=list)
    finance_quick: DashboardFinanceQuick


class ProjectDocumentResponse(BaseModel):
    id: int
    file_name: str
    file_url: str
    related_type: RelatedType
    created_at: datetime

    class Config:
        from_attributes = True
