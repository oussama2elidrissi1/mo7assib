from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from fastapi import HTTPException
from datetime import date
from app.models.salary import SalaryCalculation, PaymentStatus
from app.models.project_cycle import SalaryPayment
from app.models.attendance import Attendance, AttendanceStatus
from app.models.advance import Advance, AdvanceStatus
from app.models.employee import Employee
from app.schemas.salary import SalaryCalculateRequest, SalaryPaymentUpdate


def _parse_month(month: str):
    try:
        year, m = month.split("-")
        return int(year), int(m)
    except Exception:
        raise HTTPException(status_code=400, detail="month must be in YYYY-MM format")


def calculate_salary(db: Session, data: SalaryCalculateRequest) -> SalaryCalculation:
    year, month = _parse_month(data.month)

    employee = db.query(Employee).filter(Employee.id == data.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    existing = db.query(SalaryCalculation).filter(
        SalaryCalculation.employee_id == data.employee_id,
        SalaryCalculation.project_id == data.project_id,
        SalaryCalculation.month == data.month,
    ).first()

    attendance_rows = db.query(Attendance).filter(
        Attendance.employee_id == data.employee_id,
        Attendance.project_id == data.project_id,
        extract("year", Attendance.date) == year,
        extract("month", Attendance.date) == month,
    ).all()

    worked_days = Decimal("0")
    overtime_hours = Decimal("0")
    standard_hours_per_day = Decimal(str(employee.work_hours_per_day or 8))

    for att in attendance_rows:
        if att.status == AttendanceStatus.present:
            worked_days += Decimal("1")
        elif att.status == AttendanceStatus.half_day:
            worked_days += Decimal("0.5")
        if att.worked_hours and att.status != AttendanceStatus.absent:
            extra = Decimal(str(att.worked_hours)) - standard_hours_per_day
            if extra > 0:
                overtime_hours += extra

    daily_salary = Decimal(str(employee.daily_salary or 0))
    hourly_wage = Decimal(str(employee.hourly_wage or 0))
    if hourly_wage == 0 and daily_salary > 0 and standard_hours_per_day > 0:
        hourly_wage = daily_salary / standard_hours_per_day

    base_salary = worked_days * daily_salary
    overtime_amount = overtime_hours * hourly_wage * data.overtime_rate

    advances_total = db.query(
        func.coalesce(func.sum(Advance.approved_amount), 0)
    ).filter(
        Advance.employee_id == data.employee_id,
        Advance.project_id == data.project_id,
        Advance.status == AdvanceStatus.approved,
        Advance.month == data.month,
    ).scalar()
    advances_total = Decimal(str(advances_total))

    net_salary = base_salary + overtime_amount - advances_total - data.deductions
    if net_salary < 0:
        net_salary = Decimal("0")

    paid_amount = existing.paid_amount if existing else Decimal("0")
    remaining_amount = net_salary - paid_amount

    if paid_amount <= 0:
        payment_status = PaymentStatus.unpaid
    elif paid_amount >= net_salary:
        payment_status = PaymentStatus.paid
        remaining_amount = Decimal("0")
    else:
        payment_status = PaymentStatus.partial

    if existing:
        existing.worked_days = worked_days
        existing.base_salary = base_salary
        existing.overtime_hours = overtime_hours
        existing.overtime_amount = overtime_amount
        existing.advances_total = advances_total
        existing.deductions = data.deductions
        existing.net_salary = net_salary
        existing.remaining_amount = remaining_amount
        existing.payment_status = payment_status
        existing.notes = data.notes
        db.commit()
        db.refresh(existing)
        return existing

    salary = SalaryCalculation(
        employee_id=data.employee_id,
        project_id=data.project_id,
        month=data.month,
        worked_days=worked_days,
        base_salary=base_salary,
        overtime_hours=overtime_hours,
        overtime_amount=overtime_amount,
        advances_total=advances_total,
        deductions=data.deductions,
        net_salary=net_salary,
        paid_amount=paid_amount,
        remaining_amount=remaining_amount,
        payment_status=payment_status,
        notes=data.notes,
    )
    db.add(salary)
    db.commit()
    db.refresh(salary)
    return salary


def record_payment(db: Session, salary_id: int, data: SalaryPaymentUpdate) -> SalaryCalculation:
    salary = db.query(SalaryCalculation).filter(SalaryCalculation.id == salary_id).first()
    if not salary:
        raise HTTPException(status_code=404, detail="Salary record not found")

    salary.paid_amount = data.paid_amount
    salary.remaining_amount = salary.net_salary - data.paid_amount
    if data.paid_amount <= 0:
        salary.payment_status = PaymentStatus.unpaid
    elif data.paid_amount >= salary.net_salary:
        salary.payment_status = PaymentStatus.paid
        salary.remaining_amount = Decimal("0")
    else:
        salary.payment_status = PaymentStatus.partial
    if data.notes:
        salary.notes = data.notes
    payment = SalaryPayment(
        salary_calculation_id=salary.id,
        amount=data.paid_amount,
        payment_date=date.today(),
        notes=data.notes,
    )
    db.add(payment)
    db.commit()
    db.refresh(salary)
    return salary


def get_salaries(db: Session, project_id: int | None = None, employee_id: int | None = None, month: str | None = None) -> list[SalaryCalculation]:
    q = db.query(SalaryCalculation)
    if project_id:
        q = q.filter(SalaryCalculation.project_id == project_id)
    if employee_id:
        q = q.filter(SalaryCalculation.employee_id == employee_id)
    if month:
        q = q.filter(SalaryCalculation.month == month)
    return q.order_by(SalaryCalculation.month.desc()).all()
