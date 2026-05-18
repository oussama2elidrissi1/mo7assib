from datetime import date
from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.models.attendance import Attendance, AttendanceStatus
from app.models.document import Document
from app.models.employee import Employee
from app.models.expense import Expense, ExpenseCategory
from app.models.project import Project, ProjectStatus
from app.models.project_cycle import (
    DailySiteReport,
    DeliveryStatus,
    ProjectAssignment,
    ProjectBudget,
    ProjectPhase,
    ProjectPhaseStatus,
)
from app.models.salary import PaymentStatus, SalaryCalculation
from app.schemas.project_cycle import (
    DailySiteReportCreate,
    DashboardActivityItem,
    DashboardFinanceQuick,
    DashboardProjectCard,
    DashboardSummaryResponse,
    MaterialDeliveryResponse,
    ProjectAlert,
    ProjectAssignmentCreate,
    ProjectAssignmentResponse,
    ProjectBudgetCreate,
    ProjectBudgetResponse,
    ProjectDocumentResponse,
    ProjectFinancialSummaryV2,
    ProjectOverviewResponse,
    ProjectPhaseCreate,
    ProjectPhaseResponse,
    ProjectSalaryEmployeeSummary,
    ProjectSalarySummaryResponse,
)


def _d(value: Decimal | int | float | None) -> Decimal:
    return Decimal(str(value or 0))


def _get_project(db: Session, project_id: int) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def _get_budget_values(project: Project) -> tuple[Decimal, Decimal, Decimal, Decimal, Decimal]:
    if project.budget:
        return (
            _d(project.budget.labor_budget),
            _d(project.budget.materials_budget),
            _d(project.budget.equipment_budget),
            _d(project.budget.other_budget),
            _d(project.budget.budget_total),
        )
    budget_total = _d(project.estimated_budget)
    return (Decimal("0"), Decimal("0"), Decimal("0"), budget_total, budget_total)


def _project_progress(project: Project) -> Decimal:
    if _d(project.current_progress) > 0:
        return _d(project.current_progress).quantize(Decimal("0.01"))
    if project.phases:
        total = sum(_d(phase.progress_percentage) for phase in project.phases)
        return (total / Decimal(str(len(project.phases)))).quantize(Decimal("0.01"))
    return _d(project.current_progress)


def _validated_expenses_total(project: Project) -> Decimal:
    return sum(_d(expense.amount) for expense in project.expenses if expense.is_validated)


def _salary_total(project: Project) -> Decimal:
    return sum(_d(salary.net_salary) for salary in project.salary_calculations)


def _validated_purchases_total(project: Project) -> Decimal:
    return sum(
        _d(delivery.total_price)
        for delivery in project.material_deliveries
        if delivery.status in {DeliveryStatus.delivered, DeliveryStatus.consumed}
    )


def _budget_prevu(project: Project) -> Decimal:
    _, _, _, _, total = _get_budget_values(project)
    return total


def _cout_reel(project: Project) -> Decimal:
    return _validated_expenses_total(project) + _salary_total(project) + _validated_purchases_total(project)


def _marge_estimee(project: Project) -> Decimal:
    return _d(project.agreed_price) - _budget_prevu(project)


def _marge_reelle(project: Project) -> Decimal:
    return _d(project.agreed_price) - _cout_reel(project)


def _taux_depassement_budget(project: Project) -> Decimal:
    budget = _budget_prevu(project)
    actual = _cout_reel(project)
    if budget <= 0 or actual <= budget:
        return Decimal("0")
    return (((actual - budget) / budget) * Decimal("100")).quantize(Decimal("0.01"))


def _phase_delayed(phase: ProjectPhase) -> bool:
    if phase.status == ProjectPhaseStatus.completed or not phase.end_date:
        return False
    return phase.end_date < date.today()


def _next_phase(project: Project) -> str | None:
    ordered = sorted(project.phases, key=lambda item: item.sequence)
    for phase in ordered:
        if phase.status != ProjectPhaseStatus.completed:
            return phase.name
    return ordered[-1].name if ordered else None


def _assignment_name(project: Project, role: str) -> str | None:
    for assignment in project.assignments:
        if assignment.is_primary and role == "site_supervisor":
            return assignment.employee.name
        if assignment.assignment_role.value == role:
            return assignment.employee.name
    return None


def _site_supervisor(project: Project) -> str | None:
    return _assignment_name(project, "site_supervisor")


def _project_alerts(project: Project) -> list[ProjectAlert]:
    alerts: list[ProjectAlert] = []
    actual = _cout_reel(project)
    budget = _budget_prevu(project)
    progress = _project_progress(project)

    if budget > 0 and actual > budget * Decimal("0.8") and progress < Decimal("80"):
        alerts.append(ProjectAlert(
            level="high",
            code="budget_watch",
            title="مراقبة الميزانية",
            description="الكلفة الحقيقية فاتت 80% من الميزانية والتقدم مازال أقل من 80%.",
        ))

    delayed_phase = next((phase for phase in project.phases if _phase_delayed(phase)), None)
    if delayed_phase:
        alerts.append(ProjectAlert(
            level="medium",
            code="phase_delayed",
            title="مرحلة متأخرة",
            description=f"مرحلة {delayed_phase.name} فاتت التاريخ المحدد ديالها.",
        ))

    unpaid_count = sum(1 for salary in project.salary_calculations if salary.payment_status != PaymentStatus.paid)
    if unpaid_count:
        alerts.append(ProjectAlert(
            level="medium",
            code="salary_unpaid",
            title="رواتب غير مؤداة",
            description=f"كاين {unpaid_count} تصريح رواتب مازال ما تخلصش كامل.",
        ))

    if not any(att.date == date.today() for att in project.attendance):
        alerts.append(ProjectAlert(
            level="low",
            code="attendance_missing",
            title="النقطة اليومية ناقصة",
            description="ما كاينش pointage مسجل اليوم لهاد الورش.",
        ))

    unvalidated = sum(1 for expense in project.expenses if not expense.is_validated)
    if unvalidated:
        alerts.append(ProjectAlert(
            level="medium",
            code="expense_unvalidated",
            title="مصاريف غير مصادق عليها",
            description=f"كاين {unvalidated} مصروف مازال ما تصادقش عليه المحاسبة.",
        ))

    return alerts


def upsert_project_budget(db: Session, project_id: int, data: ProjectBudgetCreate) -> ProjectBudget:
    project = _get_project(db, project_id)
    payload = data.model_dump()
    budget_total = sum(_d(value) for value in payload.values())
    estimated_margin = _d(project.agreed_price) - budget_total
    budget = project.budget or ProjectBudget(project_id=project_id)
    for field, value in payload.items():
        setattr(budget, field, value)
    budget.budget_total = budget_total
    budget.estimated_margin = estimated_margin
    project.estimated_budget = budget_total
    if budget.id is None:
        db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


def replace_project_phases(db: Session, project_id: int, phases: list[ProjectPhaseCreate]) -> list[ProjectPhase]:
    _get_project(db, project_id)
    db.query(ProjectPhase).filter(ProjectPhase.project_id == project_id).delete()
    rows = [ProjectPhase(project_id=project_id, **phase.model_dump()) for phase in phases]
    db.add_all(rows)
    db.commit()
    return db.query(ProjectPhase).filter(ProjectPhase.project_id == project_id).order_by(ProjectPhase.sequence.asc()).all()


def get_project_phases(db: Session, project_id: int) -> list[ProjectPhaseResponse]:
    _get_project(db, project_id)
    phases = db.query(ProjectPhase).filter(ProjectPhase.project_id == project_id).order_by(ProjectPhase.sequence.asc()).all()
    return [ProjectPhaseResponse.model_validate({**phase.__dict__, "is_delayed": _phase_delayed(phase)}) for phase in phases]


def assign_project_employees(db: Session, project_id: int, assignments: list[ProjectAssignmentCreate]) -> list[ProjectAssignment]:
    _get_project(db, project_id)
    db.query(ProjectAssignment).filter(ProjectAssignment.project_id == project_id).delete()
    rows: list[ProjectAssignment] = []
    for item in assignments:
        employee = db.query(Employee).filter(Employee.id == item.employee_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail=f"Employee {item.employee_id} not found")
        employee.project_id = project_id
        employee.daily_salary = item.daily_salary
        employee.work_hours_per_day = item.work_hours_per_day
        rows.append(ProjectAssignment(project_id=project_id, **item.model_dump()))
    db.add_all(rows)
    db.commit()
    return (
        db.query(ProjectAssignment)
        .options(selectinload(ProjectAssignment.employee))
        .filter(ProjectAssignment.project_id == project_id)
        .all()
    )


def get_project_team(db: Session, project_id: int) -> list[ProjectAssignmentResponse]:
    _get_project(db, project_id)
    today_records = {
        row.employee_id: row.status.value
        for row in db.query(Attendance).filter(Attendance.project_id == project_id, Attendance.date == date.today()).all()
    }
    assignments = (
        db.query(ProjectAssignment)
        .options(selectinload(ProjectAssignment.employee))
        .filter(ProjectAssignment.project_id == project_id)
        .all()
    )
    return [
        ProjectAssignmentResponse(
            id=item.id,
            project_id=item.project_id,
            employee_id=item.employee_id,
            assignment_role=item.assignment_role,
            daily_salary=_d(item.daily_salary),
            work_hours_per_day=_d(item.work_hours_per_day),
            is_primary=item.is_primary,
            employee_name=item.employee.name,
            employee_phone=item.employee.phone,
            presence_today=today_records.get(item.employee_id),
            created_at=item.created_at,
            updated_at=item.updated_at,
        )
        for item in assignments
    ]


def upsert_daily_report(db: Session, project_id: int, data: DailySiteReportCreate) -> DailySiteReport:
    _get_project(db, project_id)
    report = db.query(DailySiteReport).filter(
        DailySiteReport.project_id == project_id,
        DailySiteReport.report_date == data.report_date,
    ).first()
    if not report:
        report = DailySiteReport(project_id=project_id, **data.model_dump())
        db.add(report)
    else:
        for field, value in data.model_dump().items():
            setattr(report, field, value)
    db.commit()
    db.refresh(report)
    return report


def get_daily_report(db: Session, project_id: int, report_date: date | None = None) -> DailySiteReport | None:
    _get_project(db, project_id)
    target_date = report_date or date.today()
    return db.query(DailySiteReport).filter(
        DailySiteReport.project_id == project_id,
        DailySiteReport.report_date == target_date,
    ).first()


def get_project_overview(db: Session, project_id: int) -> ProjectOverviewResponse:
    project = (
        db.query(Project)
        .options(
            selectinload(Project.budget),
            selectinload(Project.phases),
            selectinload(Project.assignments).selectinload(ProjectAssignment.employee),
            selectinload(Project.expenses),
            selectinload(Project.salary_calculations),
            selectinload(Project.material_deliveries),
            selectinload(Project.attendance),
            selectinload(Project.documents),
        )
        .filter(Project.id == project_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return ProjectOverviewResponse(
        id=project.id,
        name=project.name,
        city=project.city,
        location=project.location,
        address=project.address,
        status=project.status.value,
        description=project.description,
        start_date=project.start_date,
        estimated_end_date=project.estimated_end_date,
        agreed_price=_d(project.agreed_price),
        budget_prevu=_budget_prevu(project),
        cout_reel=_cout_reel(project),
        marge_estimee=_marge_estimee(project),
        marge_reelle=_marge_reelle(project),
        taux_avancement=_project_progress(project),
        taux_depassement_budget=_taux_depassement_budget(project),
        prochaine_phase=_next_phase(project),
        chef_chantier=_site_supervisor(project),
        project_manager=_assignment_name(project, "project_manager"),
        team_count=len(project.assignments),
        present_today_count=sum(
            1 for row in project.attendance if row.date == date.today() and row.status == AttendanceStatus.present
        ),
        absent_today_count=sum(
            1 for row in project.attendance if row.date == date.today() and row.status == AttendanceStatus.absent
        ),
        documents_count=len(project.documents),
        pending_expenses_count=sum(1 for row in project.expenses if not row.is_validated),
        validated_deliveries_count=sum(
            1 for row in project.material_deliveries if row.status in {DeliveryStatus.delivered, DeliveryStatus.consumed}
        ),
        delayed_phases_count=sum(1 for row in project.phases if _phase_delayed(row)),
        budget=ProjectBudgetResponse.model_validate(project.budget) if project.budget else None,
        alerts=_project_alerts(project),
    )


def get_project_financial_summary(db: Session, project_id: int) -> ProjectFinancialSummaryV2:
    project = (
        db.query(Project)
        .options(
            selectinload(Project.expenses),
            selectinload(Project.salary_calculations),
            selectinload(Project.material_deliveries),
            selectinload(Project.budget),
        )
        .filter(Project.id == project_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    breakdown = {category.value: Decimal("0") for category in ExpenseCategory}
    for expense in project.expenses:
        breakdown[expense.category.value] += _d(expense.amount)
    top_cost_items = sorted(
        [{"label": expense.title, "amount": _d(expense.amount)} for expense in project.expenses],
        key=lambda item: item["amount"],
        reverse=True,
    )[:3]
    return ProjectFinancialSummaryV2(
        project_id=project_id,
        agreed_price=_d(project.agreed_price),
        budget_prevu=_budget_prevu(project),
        cout_reel=_cout_reel(project),
        depenses_total=_validated_expenses_total(project),
        achats_valides_total=_validated_purchases_total(project),
        salaires_total=_salary_total(project),
        marge_estimee=_marge_estimee(project),
        marge_reelle=_marge_reelle(project),
        taux_depassement_budget=_taux_depassement_budget(project),
        expenses_breakdown=breakdown,
        top_cost_items=top_cost_items,
        manual_expenses=_validated_expenses_total(project),
        labor_cost=_salary_total(project),
        total_expenses=_cout_reel(project),
        estimated_margin=_marge_estimee(project),
    )


def get_project_salary_summary(db: Session, project_id: int, month: str | None = None) -> ProjectSalarySummaryResponse:
    _get_project(db, project_id)
    q = (
        db.query(SalaryCalculation)
        .options(selectinload(SalaryCalculation.employee), selectinload(SalaryCalculation.payments))
        .filter(SalaryCalculation.project_id == project_id)
    )
    if month:
        q = q.filter(SalaryCalculation.month == month)
    salaries = q.order_by(SalaryCalculation.month.desc()).all()
    active_month = month or (salaries[0].month if salaries else date.today().strftime("%Y-%m"))
    gross_total = sum(_d(item.base_salary) for item in salaries)
    overtime_total = sum(_d(item.overtime_amount) for item in salaries)
    advances_total = sum(_d(item.advances_total) for item in salaries)
    net_total = sum(_d(item.net_salary) for item in salaries)
    paid_total = sum(_d(item.paid_amount) for item in salaries)
    remaining_total = sum(_d(item.remaining_amount) for item in salaries)
    return ProjectSalarySummaryResponse(
        project_id=project_id,
        month=active_month,
        gross_total=gross_total,
        overtime_total=overtime_total,
        advances_total=advances_total,
        net_total=net_total,
        paid_total=paid_total,
        remaining_total=remaining_total,
        unpaid_count=sum(1 for item in salaries if item.payment_status != PaymentStatus.paid),
        salaries=[
            ProjectSalaryEmployeeSummary(
                salary_id=item.id,
                employee_id=item.employee_id,
                employee_name=item.employee.name,
                month=item.month,
                worked_days=_d(item.worked_days),
                gross_salary=_d(item.base_salary),
                overtime_amount=_d(item.overtime_amount),
                advances_total=_d(item.advances_total),
                deductions=_d(item.deductions),
                net_salary=_d(item.net_salary),
                paid_amount=_d(item.paid_amount),
                remaining_amount=_d(item.remaining_amount),
                payment_status=item.payment_status,
                payments=item.payments,
            )
            for item in salaries
        ],
    )


def get_project_documents(db: Session, project_id: int) -> list[ProjectDocumentResponse]:
    _get_project(db, project_id)
    docs = db.query(Document).filter(Document.project_id == project_id).order_by(Document.created_at.desc()).all()
    return [ProjectDocumentResponse.model_validate(doc) for doc in docs]


def get_material_deliveries(db: Session, project_id: int) -> list[MaterialDeliveryResponse]:
    project = _get_project(db, project_id)
    return [MaterialDeliveryResponse.model_validate(item) for item in project.material_deliveries]


def get_dashboard_summary(db: Session, user_name: str) -> DashboardSummaryResponse:
    projects = (
        db.query(Project)
        .options(
            selectinload(Project.budget),
            selectinload(Project.phases),
            selectinload(Project.assignments).selectinload(ProjectAssignment.employee),
            selectinload(Project.expenses),
            selectinload(Project.salary_calculations),
            selectinload(Project.material_deliveries),
            selectinload(Project.attendance),
        )
        .all()
    )
    active_projects = [project for project in projects if project.status == ProjectStatus.active]
    delayed_projects = [project for project in projects if any(_phase_delayed(phase) for phase in project.phases)]
    budget_total = sum(_budget_prevu(project) for project in active_projects)
    actual_total = sum(_cout_reel(project) for project in active_projects)
    margin_total = sum(_marge_estimee(project) for project in active_projects)
    monthly_expenses = _d(
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(
            func.extract("year", Expense.expense_date) == date.today().year,
            func.extract("month", Expense.expense_date) == date.today().month,
        )
        .scalar()
    )
    salaries_due = _d(db.query(func.coalesce(func.sum(SalaryCalculation.remaining_amount), 0)).scalar())
    present_today = db.query(func.count(Attendance.id)).filter(
        Attendance.date == date.today(),
        Attendance.status == AttendanceStatus.present,
    ).scalar() or 0

    alerts: list[ProjectAlert] = []
    for project in projects:
        alerts.extend(_project_alerts(project))
    alerts = alerts[:6]

    active_cards = [
        DashboardProjectCard(
            id=project.id,
            name=project.name,
            city=project.city or project.location,
            status=project.status.value,
            progress=_project_progress(project),
            budget_prevu=_budget_prevu(project),
            cout_reel=_cout_reel(project),
            marge_estimee=_marge_estimee(project),
            prochaine_phase=_next_phase(project),
            chef_chantier=_site_supervisor(project),
        )
        for project in active_projects[:6]
    ]

    today_activity = [
        DashboardActivityItem(
            label="النقطة اليومية",
            value=str(db.query(func.count(Attendance.id)).filter(Attendance.date == date.today()).scalar() or 0),
        ),
        DashboardActivityItem(
            label="المصاريف المضافة",
            value=str(db.query(func.count(Expense.id)).filter(Expense.expense_date == date.today()).scalar() or 0),
        ),
        DashboardActivityItem(
            label="التسليمات المستلمة",
            value=str(sum(1 for project in projects for delivery in project.material_deliveries if delivery.delivery_date == date.today())),
        ),
        DashboardActivityItem(
            label="المراحل المنجزة",
            value=str(sum(1 for project in projects for phase in project.phases if phase.status == ProjectPhaseStatus.completed)),
        ),
        DashboardActivityItem(
            label="تقارير رؤساء الأوراش",
            value=str(db.query(func.count(DailySiteReport.id)).filter(DailySiteReport.report_date == date.today()).scalar() or 0),
        ),
    ]

    finance_quick = DashboardFinanceQuick(
        budget_vs_actual=[
            {"label": project.name, "budget": _budget_prevu(project), "actual": _cout_reel(project)}
            for project in active_projects[:4]
        ],
        expenses_distribution=[
            {
                "label": category.value,
                "amount": _d(
                    db.query(func.coalesce(func.sum(Expense.amount), 0)).filter(Expense.category == category).scalar()
                ),
            }
            for category in ExpenseCategory
        ],
        top_cost_projects=sorted(active_cards, key=lambda item: item.cout_reel, reverse=True)[:3],
    )

    return DashboardSummaryResponse(
        greeting_name=user_name,
        active_projects=len(active_projects),
        delayed_projects=len(delayed_projects),
        budget_total_engaged=budget_total,
        cout_reel_total=actual_total,
        marge_estimee_total=margin_total,
        depenses_mois=monthly_expenses,
        salaires_a_payer=salaries_due,
        employes_presents_aujourdhui=present_today,
        alerts=alerts,
        active_site_cards=active_cards,
        today_activity=today_activity,
        finance_quick=finance_quick,
    )
