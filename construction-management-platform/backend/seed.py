"""Business-oriented demo seed. Run: python seed.py"""

import os
import sys
from datetime import date, timedelta
from decimal import Decimal

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.advance import Advance, AdvanceStatus
from app.models.attendance import Attendance, AttendanceStatus
from app.models.building import Building
from app.models.document import Document, RelatedType
from app.models.employee import Employee, EmployeeRole
from app.models.expense import Expense, ExpenseCategory, PaymentMethod
from app.models.project import ClientType, Project, ProjectStatus, ProjectType
from app.models.project_cycle import (
    AssignmentRole,
    DailySiteReport,
    DeliveryStatus,
    MaterialDelivery,
    ProjectAssignment,
    ProjectBudget,
    ProjectPhase,
    ProjectPhaseKey,
    ProjectPhaseStatus,
    SalaryPayment,
    Supplier,
)
from app.models.project_land import ProjectLand
from app.models.salary import PaymentStatus, SalaryCalculation
from app.models.user import User, UserRole


def money(value: str) -> Decimal:
    return Decimal(value)


def add_attendance(db, project_id: int, employees: list[Employee], start_day: date, days: int = 14):
    cycle = [
        AttendanceStatus.present,
        AttendanceStatus.present,
        AttendanceStatus.half_day,
        AttendanceStatus.present,
        AttendanceStatus.absent,
    ]
    for employee_index, employee in enumerate(employees):
        for offset in range(days):
            current_day = start_day - timedelta(days=offset)
            if current_day.weekday() == 6:
                continue
            status = cycle[(employee_index + offset) % len(cycle)]
            worked = Decimal("8") if status == AttendanceStatus.present else Decimal("4") if status == AttendanceStatus.half_day else Decimal("0")
            overtime = Decimal("1.5") if status == AttendanceStatus.present and offset % 5 == 0 else Decimal("0")
            db.add(
                Attendance(
                    employee_id=employee.id,
                    project_id=project_id,
                    date=current_day,
                    status=status,
                    worked_hours=worked + overtime,
                    overtime_hours=overtime,
                    notes="تسجيل يومي تلقائي",
                    supervisor_note="التقدم عادي في الأشغال" if status != AttendanceStatus.absent else "غياب بدون تعويض",
                    tasks_completed="مراقبة الحديد والخرسانة" if status != AttendanceStatus.absent else None,
                    photo_count=2 if status != AttendanceStatus.absent else 0,
                )
            )


def seed():
    db = SessionLocal()
    try:
        if db.query(Project).count() > 0:
            print("Demo data already exists. Skipping seed.")
            return

        admin = User(
            name="Admin Mo7assib",
            email="admin@example.com",
            password_hash=hash_password("password123"),
            role=UserRole.admin,
            is_active=True,
        )
        db.add(admin)
        db.flush()

        today = date.today()
        last_month = (today.replace(day=1) - timedelta(days=1)).strftime("%Y-%m")
        current_month = today.strftime("%Y-%m")

        projects = [
            Project(
                name="Villa Marrakech",
                client_type=ClientType.private,
                location="Marrakech",
                city="Marrakech",
                address="Route de l'Ourika, Marrakech",
                project_type=ProjectType.labor_with_materials,
                status=ProjectStatus.active,
                start_date=date(today.year - 1, 10, 1),
                estimated_end_date=date(today.year, 10, 30),
                agreed_price=money("1800000"),
                estimated_budget=money("1500000"),
                current_progress=Decimal("65"),
                estimated_duration_days=365,
                description="Villa R+2 avec piscine, lotissement privé, finitions premium.",
                created_by=admin.id,
            ),
            Project(
                name="Immeuble R+4 Casablanca",
                client_type=ClientType.private,
                location="Casablanca",
                city="Casablanca",
                address="Sidi Maarouf, Casablanca",
                project_type=ProjectType.labor_with_materials,
                status=ProjectStatus.active,
                start_date=date(today.year - 1, 8, 1),
                estimated_end_date=date(today.year, 12, 20),
                agreed_price=money("4500000"),
                estimated_budget=money("3800000"),
                current_progress=Decimal("38"),
                estimated_duration_days=520,
                description="Immeuble résidentiel R+4 avec sous-sol et 20 appartements.",
                created_by=admin.id,
            ),
            Project(
                name="Résidence Al Baraka Temara",
                client_type=ClientType.public,
                location="Temara",
                city="Temara",
                address="Avenue Mohammed V, Temara",
                project_type=ProjectType.labor_only,
                status=ProjectStatus.draft,
                start_date=date(today.year, 7, 1),
                estimated_end_date=date(today.year + 1, 12, 31),
                agreed_price=money("6200000"),
                estimated_budget=money("5400000"),
                current_progress=Decimal("0"),
                estimated_duration_days=540,
                description="Résidence sociale publique, phase de préparation et montage budgétaire.",
                created_by=admin.id,
            ),
        ]
        db.add_all(projects)
        db.flush()

        db.add_all(
            [
                ProjectLand(
                    project_id=projects[0].id,
                    surface_area_m2=money("600"),
                    land_address=projects[0].address,
                    title_reference="TF-84573/MRK",
                    floors_count=2,
                    has_basement=False,
                    basement_count=0,
                    contract_scope="labor_with_materials",
                    terrain_documents="Contrat signé, plan béton armé, autorisation communale",
                    notes="Titre foncier régularisé",
                ),
                ProjectLand(
                    project_id=projects[1].id,
                    surface_area_m2=money("850"),
                    land_address=projects[1].address,
                    title_reference="TF-99211/CAS",
                    floors_count=4,
                    has_basement=True,
                    basement_count=1,
                    contract_scope="labor_with_materials",
                    terrain_documents="Étude géotechnique, plan de coffrage, PV implantation",
                    notes="Sous-sol parking et local technique",
                ),
                ProjectLand(
                    project_id=projects[2].id,
                    surface_area_m2=money("3200"),
                    land_address=projects[2].address,
                    title_reference="DOM-1142/TMR",
                    floors_count=4,
                    has_basement=False,
                    basement_count=0,
                    contract_scope="labor_only",
                    terrain_documents="CPS provisoire, note de cadrage, autorisations en préparation",
                    notes="Terrain communal prêt pour lancement AO",
                ),
            ]
        )

        db.add_all(
            [
                Building(project_id=projects[0].id, name="Villa principale", surface_area_m2=money("450"), number_of_floors=2, number_of_apartments=1, notes="Bloc unique"),
                Building(project_id=projects[1].id, name="Bloc A", surface_area_m2=money("420"), number_of_floors=4, number_of_apartments=10, notes="Façade rue"),
                Building(project_id=projects[1].id, name="Bloc B", surface_area_m2=money("410"), number_of_floors=4, number_of_apartments=10, notes="Cour intérieure"),
            ]
        )

        budgets = [
            ProjectBudget(project_id=projects[0].id, labor_budget=money("420000"), materials_budget=money("760000"), equipment_budget=money("180000"), other_budget=money("140000"), budget_total=money("1500000"), estimated_margin=money("300000")),
            ProjectBudget(project_id=projects[1].id, labor_budget=money("1080000"), materials_budget=money("1820000"), equipment_budget=money("540000"), other_budget=money("360000"), budget_total=money("3800000"), estimated_margin=money("700000")),
            ProjectBudget(project_id=projects[2].id, labor_budget=money("1450000"), materials_budget=money("2680000"), equipment_budget=money("720000"), other_budget=money("550000"), budget_total=money("5400000"), estimated_margin=money("800000")),
        ]
        db.add_all(budgets)

        phase_templates = [
            ("التهيئة والحفر", ProjectPhaseKey.earthwork),
            ("الأساسات", ProjectPhaseKey.foundation),
            ("الهيكل", ProjectPhaseKey.structure),
            ("الكهرباء", ProjectPhaseKey.electricity),
            ("السباكة", ProjectPhaseKey.plumbing),
            ("اللياسة", ProjectPhaseKey.plaster),
            ("التبليط", ProjectPhaseKey.tiling),
            ("الصباغة", ProjectPhaseKey.painting),
            ("التشطيب", ProjectPhaseKey.finishing),
            ("التسليم", ProjectPhaseKey.delivery),
        ]
        phase_progress = {
            projects[0].id: [100, 100, 60, 25, 15, 0, 0, 0, 0, 0],
            projects[1].id: [100, 100, 70, 10, 0, 0, 0, 0, 0, 0],
            projects[2].id: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
        phase_status = {
            projects[0].id: [ProjectPhaseStatus.completed, ProjectPhaseStatus.completed, ProjectPhaseStatus.in_progress, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending],
            projects[1].id: [ProjectPhaseStatus.completed, ProjectPhaseStatus.completed, ProjectPhaseStatus.delayed, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending, ProjectPhaseStatus.pending],
            projects[2].id: [ProjectPhaseStatus.pending] * 10,
        }
        phase_windows = {
            projects[0].id: [
                (today - timedelta(days=260), today - timedelta(days=220)),
                (today - timedelta(days=220), today - timedelta(days=170)),
                (today - timedelta(days=170), today + timedelta(days=25)),
                (today + timedelta(days=25), today + timedelta(days=60)),
                (today + timedelta(days=60), today + timedelta(days=95)),
                (today + timedelta(days=95), today + timedelta(days=135)),
                (today + timedelta(days=135), today + timedelta(days=170)),
                (today + timedelta(days=170), today + timedelta(days=210)),
                (today + timedelta(days=210), today + timedelta(days=250)),
                (today + timedelta(days=250), today + timedelta(days=290)),
            ],
            projects[1].id: [
                (today - timedelta(days=310), today - timedelta(days=270)),
                (today - timedelta(days=270), today - timedelta(days=225)),
                (today - timedelta(days=225), today - timedelta(days=15)),
                (today + timedelta(days=10), today + timedelta(days=45)),
                (today + timedelta(days=45), today + timedelta(days=80)),
                (today + timedelta(days=80), today + timedelta(days=120)),
                (today + timedelta(days=120), today + timedelta(days=155)),
                (today + timedelta(days=155), today + timedelta(days=195)),
                (today + timedelta(days=195), today + timedelta(days=235)),
                (today + timedelta(days=235), today + timedelta(days=275)),
            ],
            projects[2].id: [
                (today + timedelta(days=20), today + timedelta(days=55)),
                (today + timedelta(days=55), today + timedelta(days=90)),
                (today + timedelta(days=90), today + timedelta(days=135)),
                (today + timedelta(days=135), today + timedelta(days=175)),
                (today + timedelta(days=175), today + timedelta(days=210)),
                (today + timedelta(days=210), today + timedelta(days=250)),
                (today + timedelta(days=250), today + timedelta(days=285)),
                (today + timedelta(days=285), today + timedelta(days=325)),
                (today + timedelta(days=325), today + timedelta(days=365)),
                (today + timedelta(days=365), today + timedelta(days=405)),
            ],
        }
        for project in projects:
            project_budget = next(item for item in budgets if item.project_id == project.id)
            for index, (label, key) in enumerate(phase_templates):
                start_window, end_window = phase_windows[project.id][index]
                db.add(
                    ProjectPhase(
                        project_id=project.id,
                        name=label,
                        phase_key=key,
                        sequence=index + 1,
                        status=phase_status[project.id][index],
                        start_date=start_window,
                        end_date=end_window,
                        progress_percentage=Decimal(str(phase_progress[project.id][index])),
                        budget_planned=(project_budget.budget_total / Decimal("10")).quantize(Decimal("0.01")),
                        actual_cost=(project_budget.budget_total / Decimal("12") * Decimal(str(max(phase_progress[project.id][index], 1))) / Decimal("100")).quantize(Decimal("0.01")),
                        notes="Phase standard du cycle chantier",
                    )
                )

        employees = [
            Employee(project_id=projects[0].id, name="Khalid Benali", role=EmployeeRole.engineer, phone="0661234501", cin="BE123456", job_title="Chef projet", daily_salary=money("650"), hourly_wage=money("81.25"), work_hours_per_day=Decimal("8")),
            Employee(project_id=projects[0].id, name="Rachid Tahiri", role=EmployeeRole.site_supervisor, phone="0661234502", cin="TA654321", job_title="Chef chantier", daily_salary=money("420"), hourly_wage=money("52.5"), work_hours_per_day=Decimal("8")),
            Employee(project_id=projects[0].id, name="Mohammed Zidane", role=EmployeeRole.maalem, phone="0661234503", cin="ZI112233", job_title="Maâlem maçonnerie", daily_salary=money("280"), hourly_wage=money("35"), work_hours_per_day=Decimal("8")),
            Employee(project_id=projects[0].id, name="Hassan Oubiri", role=EmployeeRole.worker, phone="0661234504", cin="OU445566", job_title="Ouvrier polyvalent", daily_salary=money("170"), hourly_wage=money("21.25"), work_hours_per_day=Decimal("8")),
            Employee(project_id=projects[1].id, name="Youssef Alaoui", role=EmployeeRole.engineer, phone="0661234505", cin="AL778899", job_title="Chef projet structure", daily_salary=money("700"), hourly_wage=money("87.5"), work_hours_per_day=Decimal("8")),
            Employee(project_id=projects[1].id, name="Abderrahim Kabbaj", role=EmployeeRole.site_supervisor, phone="0661234506", cin="KA334455", job_title="Chef chantier gros œuvre", daily_salary=money("430"), hourly_wage=money("53.75"), work_hours_per_day=Decimal("8")),
            Employee(project_id=projects[1].id, name="Fatima Zahra Idrissi", role=EmployeeRole.accountant, phone="0661234507", cin="ID667788", job_title="Comptable chantier", daily_salary=money("380"), hourly_wage=money("47.5"), work_hours_per_day=Decimal("8")),
            Employee(project_id=projects[1].id, name="Omar Cherkaoui", role=EmployeeRole.maalem, phone="0661234508", cin="CH990011", job_title="Maâlem coffrage", daily_salary=money("310"), hourly_wage=money("38.75"), work_hours_per_day=Decimal("8")),
            Employee(project_id=projects[1].id, name="Noureddine Sabri", role=EmployeeRole.worker, phone="0661234509", cin="SA889900", job_title="Ouvrier ferraillage", daily_salary=money("190"), hourly_wage=money("23.75"), work_hours_per_day=Decimal("8")),
            Employee(project_id=projects[2].id, name="Salma Bennis", role=EmployeeRole.engineer, phone="0661234510", cin="BE102030", job_title="Chef projet étude", daily_salary=money("620"), hourly_wage=money("77.5"), work_hours_per_day=Decimal("8")),
            Employee(project_id=projects[2].id, name="Driss Lamrani", role=EmployeeRole.site_supervisor, phone="0661234511", cin="LA908070", job_title="Chef chantier pré-lancement", daily_salary=money("400"), hourly_wage=money("50"), work_hours_per_day=Decimal("8")),
        ]
        db.add_all(employees)
        db.flush()

        assignment_rows = [
            (projects[0], employees[0], AssignmentRole.project_manager, False),
            (projects[0], employees[1], AssignmentRole.site_supervisor, True),
            (projects[0], employees[2], AssignmentRole.maalem, False),
            (projects[0], employees[3], AssignmentRole.worker, False),
            (projects[1], employees[4], AssignmentRole.project_manager, False),
            (projects[1], employees[5], AssignmentRole.site_supervisor, True),
            (projects[1], employees[6], AssignmentRole.accountant, False),
            (projects[1], employees[7], AssignmentRole.maalem, False),
            (projects[1], employees[8], AssignmentRole.worker, False),
            (projects[2], employees[9], AssignmentRole.project_manager, False),
            (projects[2], employees[10], AssignmentRole.site_supervisor, True),
        ]
        for project, employee, role, primary in assignment_rows:
            db.add(
                ProjectAssignment(
                    project_id=project.id,
                    employee_id=employee.id,
                    assignment_role=role,
                    daily_salary=employee.daily_salary,
                    work_hours_per_day=employee.work_hours_per_day,
                    is_primary=primary,
                )
            )

        add_attendance(db, projects[0].id, employees[:4], today)
        add_attendance(db, projects[1].id, employees[4:9], today)
        add_attendance(db, projects[2].id, employees[9:], today, 5)

        suppliers = [
            Supplier(name="LafargeHolcim Maroc", phone="0522000001", city="Casablanca", specialty="Ciment"),
            Supplier(name="Acier Atlas", phone="0522000002", city="Casablanca", specialty="Fer"),
            Supplier(name="Carrière Ourika", phone="0522000003", city="Marrakech", specialty="Agrégats"),
        ]
        db.add_all(suppliers)
        db.flush()

        deliveries = [
            MaterialDelivery(project_id=projects[0].id, supplier_id=suppliers[0].id, title="Commande ciment avril", material_name="Ciment 50kg", quantity=money("400"), unit="sac", unit_price=money("78"), total_price=money("31200"), delivery_date=today - timedelta(days=9), status=DeliveryStatus.delivered, stock_quantity=money("35"), notes="Livraison complète"),
            MaterialDelivery(project_id=projects[0].id, supplier_id=suppliers[2].id, title="Sable et gravier", material_name="Agrégats", quantity=money("22"), unit="m3", unit_price=money("420"), total_price=money("9240"), delivery_date=today - timedelta(days=6), status=DeliveryStatus.consumed, stock_quantity=money("4"), notes="Utilisé sur gros œuvre"),
            MaterialDelivery(project_id=projects[1].id, supplier_id=suppliers[1].id, title="Fer HA16", material_name="Fer à béton 16mm", quantity=money("18"), unit="tonne", unit_price=money("12800"), total_price=money("230400"), delivery_date=today - timedelta(days=12), status=DeliveryStatus.delivered, stock_quantity=money("6"), notes="Stock encore important"),
            MaterialDelivery(project_id=projects[1].id, supplier_id=suppliers[0].id, title="Ciment structure", material_name="Ciment CEM II", quantity=money("1200"), unit="sac", unit_price=money("79"), total_price=money("94800"), delivery_date=today - timedelta(days=4), status=DeliveryStatus.delivered, stock_quantity=money("160"), notes="Dernière livraison de dalle"),
            MaterialDelivery(project_id=projects[2].id, supplier_id=suppliers[1].id, title="Pré-commande fer", material_name="Fer à béton", quantity=money("10"), unit="tonne", unit_price=money("12600"), total_price=money("126000"), delivery_date=today + timedelta(days=20), status=DeliveryStatus.ordered, stock_quantity=money("0"), notes="Commande préparatoire"),
        ]
        db.add_all(deliveries)

        expenses = [
            Expense(project_id=projects[0].id, category=ExpenseCategory.materials, title="Achats ciment et agrégats", amount=money("65200"), expense_date=today - timedelta(days=25), payment_method=PaymentMethod.bank_transfer, supplier_name="LafargeHolcim Maroc", is_validated=True, validated_by=admin.id, notes="Validé comptabilité"),
            Expense(project_id=projects[0].id, category=ExpenseCategory.transport, title="Transport matériaux", amount=money("8400"), expense_date=today - timedelta(days=20), payment_method=PaymentMethod.cash, supplier_name="Transport Atlas", is_validated=True, validated_by=admin.id, notes="Transport chantier"),
            Expense(project_id=projects[0].id, category=ExpenseCategory.equipment, title="Location mini-pelle", amount=money("14500"), expense_date=today - timedelta(days=10), payment_method=PaymentMethod.check, supplier_name="Atlas Equipement", is_validated=False, notes="En attente facture finale"),
            Expense(project_id=projects[1].id, category=ExpenseCategory.materials, title="Ferraillage gros œuvre", amount=money("235000"), expense_date=today - timedelta(days=28), payment_method=PaymentMethod.bank_transfer, supplier_name="Acier Atlas", is_validated=True, validated_by=admin.id, notes="Validé"),
            Expense(project_id=projects[1].id, category=ExpenseCategory.equipment, title="Location grue mobile", amount=money("96000"), expense_date=today - timedelta(days=14), payment_method=PaymentMethod.check, supplier_name="Levage Plus", is_validated=True, validated_by=admin.id, notes="Validé"),
            Expense(project_id=projects[1].id, category=ExpenseCategory.materials, title="Achat béton et coffrage phase structure", amount=money("1180000"), expense_date=today - timedelta(days=18), payment_method=PaymentMethod.bank_transfer, supplier_name="Beton Ready Maroc", is_validated=True, validated_by=admin.id, notes="Consommation structure"),
            Expense(project_id=projects[1].id, category=ExpenseCategory.labor, title="Sous-traitance gros œuvre", amount=money("980000"), expense_date=today - timedelta(days=12), payment_method=PaymentMethod.bank_transfer, supplier_name="Sous-traitance Atlas", is_validated=True, validated_by=admin.id, notes="Avancement rapide mais coûteux"),
            Expense(project_id=projects[1].id, category=ExpenseCategory.transport, title="Logistique béton et pompage", amount=money("360000"), expense_date=today - timedelta(days=11), payment_method=PaymentMethod.bank_transfer, supplier_name="Logistique Chantier Pro", is_validated=True, validated_by=admin.id, notes="Surcoût logistique structure"),
            Expense(project_id=projects[1].id, category=ExpenseCategory.admin, title="Honoraires topographie", amount=money("18000"), expense_date=today - timedelta(days=8), payment_method=PaymentMethod.bank_transfer, supplier_name="Geo Maroc", is_validated=False, notes="En cours de validation"),
            Expense(project_id=projects[2].id, category=ExpenseCategory.admin, title="Étude préliminaire", amount=money("22000"), expense_date=today - timedelta(days=3), payment_method=PaymentMethod.bank_transfer, supplier_name="BET Rabat", is_validated=True, validated_by=admin.id, notes="Préparation AO"),
        ]
        db.add_all(expenses)

        advances = [
            Advance(employee_id=employees[1].id, project_id=projects[0].id, requested_amount=money("2000"), approved_amount=money("2000"), reason="Urgence familiale", status=AdvanceStatus.approved, approved_by=admin.id, advance_date=today - timedelta(days=20), month=last_month),
            Advance(employee_id=employees[2].id, project_id=projects[0].id, requested_amount=money("1500"), approved_amount=money("1500"), reason="Frais logement", status=AdvanceStatus.approved, approved_by=admin.id, advance_date=today - timedelta(days=8), month=current_month),
            Advance(employee_id=employees[8].id, project_id=projects[1].id, requested_amount=money("900"), reason="Avance demandée", status=AdvanceStatus.pending, advance_date=today - timedelta(days=2), month=current_month),
        ]
        db.add_all(advances)

        salaries = [
            SalaryCalculation(employee_id=employees[0].id, project_id=projects[0].id, month=current_month, worked_days=money("24"), base_salary=money("15600"), overtime_hours=money("6"), overtime_amount=money("731"), advances_total=money("0"), deductions=money("0"), net_salary=money("16331"), paid_amount=money("8000"), remaining_amount=money("8331"), payment_status=PaymentStatus.partial, notes="Paiement partiel"),
            SalaryCalculation(employee_id=employees[1].id, project_id=projects[0].id, month=current_month, worked_days=money("23"), base_salary=money("9660"), overtime_hours=money("4"), overtime_amount=money("315"), advances_total=money("0"), deductions=money("0"), net_salary=money("9975"), paid_amount=money("0"), remaining_amount=money("9975"), payment_status=PaymentStatus.unpaid, notes="A payer fin de mois"),
            SalaryCalculation(employee_id=employees[5].id, project_id=projects[1].id, month=current_month, worked_days=money("24"), base_salary=money("10320"), overtime_hours=money("8"), overtime_amount=money("645"), advances_total=money("0"), deductions=money("0"), net_salary=money("10965"), paid_amount=money("6000"), remaining_amount=money("4965"), payment_status=PaymentStatus.partial, notes="Reste à solder"),
            SalaryCalculation(employee_id=employees[6].id, project_id=projects[1].id, month=current_month, worked_days=money("24"), base_salary=money("9120"), overtime_hours=money("2"), overtime_amount=money("143"), advances_total=money("0"), deductions=money("0"), net_salary=money("9263"), paid_amount=money("9263"), remaining_amount=money("0"), payment_status=PaymentStatus.paid, notes="Soldé"),
        ]
        db.add_all(salaries)
        db.flush()

        db.add_all(
            [
                SalaryPayment(salary_calculation_id=salaries[0].id, amount=money("8000"), payment_date=today - timedelta(days=1), payment_method="cash", notes="Acompte"),
                SalaryPayment(salary_calculation_id=salaries[2].id, amount=money("6000"), payment_date=today - timedelta(days=1), payment_method="cash", notes="Paiement partiel"),
                SalaryPayment(salary_calculation_id=salaries[3].id, amount=money("9263"), payment_date=today - timedelta(days=3), payment_method="bank_transfer", notes="Paiement complet"),
            ]
        )

        daily_reports = [
            DailySiteReport(project_id=projects[0].id, report_date=today, attendance_completed=True, completed_tasks="صب سقف جزئي وتحضير plomberie", supervisor_note="الإيقاع مزيان والمواد كافية لثلاثة أيام", photo_urls="/uploads/demo/villa-1.jpg,/uploads/demo/villa-2.jpg", deliveries_received=1, expenses_added=1),
            DailySiteReport(project_id=projects[1].id, report_date=today, attendance_completed=True, completed_tasks="تركيب coffrage للدالة وتأخير في حديد slab", supervisor_note="خص تسريع توريد الحديد لأن المرحلة متأخرة", photo_urls="/uploads/demo/immeuble-1.jpg", deliveries_received=0, expenses_added=0),
            DailySiteReport(project_id=projects[2].id, report_date=today, attendance_completed=False, completed_tasks="اجتماع تحضير دفتر التحملات", supervisor_note="المشروع مازال في مرحلة الإطلاق", photo_urls="", deliveries_received=0, expenses_added=1),
        ]
        db.add_all(daily_reports)

        db.add_all(
            [
                Document(project_id=projects[0].id, related_type=RelatedType.contract, file_name="contrat-villa-marrakech.pdf", file_url="/uploads/demo/contrat-villa-marrakech.pdf", uploaded_by=admin.id),
                Document(project_id=projects[0].id, related_type=RelatedType.site_photo, file_name="photo-chantier-villa-01.jpg", file_url="/uploads/demo/photo-chantier-villa-01.jpg", uploaded_by=admin.id),
                Document(project_id=projects[1].id, related_type=RelatedType.invoice, file_name="facture-ferraillage.pdf", file_url="/uploads/demo/facture-ferraillage.pdf", uploaded_by=admin.id),
                Document(project_id=projects[1].id, related_type=RelatedType.delivery_note, file_name="bon-livraison-ciment.pdf", file_url="/uploads/demo/bon-livraison-ciment.pdf", uploaded_by=admin.id),
                Document(project_id=projects[2].id, related_type=RelatedType.plan, file_name="plan-residence-temara.pdf", file_url="/uploads/demo/plan-residence-temara.pdf", uploaded_by=admin.id),
            ]
        )

        db.commit()
        print("Seed completed")
        print("Login: admin@example.com / password123")
        print("Projects: 3")
        print("Employees: 11")
        print("Attendance horizon: 14 days")
        print("Lifecycle data: budgets, phases, assignments, deliveries, reports, salaries, documents")
    except Exception as exc:
        db.rollback()
        print(f"Seed error: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
