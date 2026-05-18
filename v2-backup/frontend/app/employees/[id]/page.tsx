"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/api";
import type { Employee, Attendance, Advance, SalaryCalculation, Project } from "@/lib/types";
import {
  EMPLOYEE_ROLE_LABELS, ADVANCE_STATUS_LABELS, PAYMENT_STATUS_LABELS, formatMAD,
} from "@/lib/types";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

// ATTENDANCE_STATUS_LABELS doesn't exist yet — define inline
const ATT_LABELS: Record<string, string> = {
  present: "حاضر", absent: "غائب", half_day: "نصف يوم",
};
const ATT_COLORS: Record<string, string> = {
  present: "bg-green-100 text-green-700",
  absent: "bg-red-100 text-red-700",
  half_day: "bg-yellow-100 text-yellow-700",
};

const ADV_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const PAY_COLORS: Record<string, string> = {
  unpaid: "bg-red-100 text-red-700",
  partial: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
};

type Tab = "attendance" | "advances" | "salaries";

export default function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [salaries, setSalaries] = useState<SalaryCalculation[]>([]);
  const [tab, setTab] = useState<Tab>("attendance");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const emp: Employee = await api.get(`/employees/${id}`).then((r) => r.data);
      setEmployee(emp);

      const [attData, advData, salData, proj] = await Promise.all([
        api.get(`/attendance/project/${emp.project_id}?employee_id=${id}`).then((r) =>
          r.data.filter((a: Attendance) => a.employee_id === Number(id))
        ).catch(() => []),
        api.get(`/advances?employee_id=${id}`).then((r) => r.data).catch(() => []),
        api.get(`/salaries?employee_id=${id}`).then((r) => r.data).catch(() => []),
        api.get(`/projects/${emp.project_id}`).then((r) => r.data).catch(() => null),
      ]);

      setAttendance(attData);
      setAdvances(advData);
      setSalaries(salData);
      setProject(proj);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return <AppShell><div className="text-center py-16 text-gray-400">جارٍ التحميل...</div></AppShell>;
  }
  if (!employee) {
    return <AppShell><div className="text-center py-16 text-gray-400">الموظف غير موجود</div></AppShell>;
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "attendance", label: "الحضور", count: attendance.length },
    { key: "advances", label: "السلف", count: advances.length },
    { key: "salaries", label: "الرواتب", count: salaries.length },
  ];

  // Compute stats
  const presentDays = attendance.filter((a) => a.status === "present").length;
  const absentDays = attendance.filter((a) => a.status === "absent").length;
  const totalAdvances = advances.filter((a) => a.status === "approved")
    .reduce((s, a) => s + Number(a.approved_amount ?? 0), 0);

  return (
    <AppShell>
      <div dir="rtl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/employees" className="hover:text-primary-500 flex items-center gap-1">
            <ArrowRight size={14} /> الموظفون
          </Link>
          <span>/</span>
          <span className="text-gray-900">{employee.name}</span>
        </div>

        {/* Profile header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={32} className="text-primary-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{employee.name}</h1>
              <p className="text-gray-500 text-sm">{employee.job_title || EMPLOYEE_ROLE_LABELS[employee.role]}</p>
              {project && <p className="text-xs text-primary-500 mt-0.5">{project.name}</p>}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              employee.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {employee.is_active ? "نشط" : "غير نشط"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
            {[
              { label: "رقم الهاتف", value: employee.phone ?? "—" },
              { label: "رقم CIN", value: employee.cin ?? "—" },
              { label: "الأجر اليومي", value: formatMAD(employee.daily_salary ? Number(employee.daily_salary) : undefined) },
              { label: "ساعات العمل/يوم", value: `${employee.work_hours_per_day ?? 8} ساعات` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-semibold text-gray-900 text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{presentDays}</p>
            <p className="text-xs text-gray-500 mt-1">أيام حضور</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{absentDays}</p>
            <p className="text-xs text-gray-500 mt-1">أيام غياب</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{formatMAD(totalAdvances)}</p>
            <p className="text-xs text-gray-500 mt-1">سلف معتمدة</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex border-b border-gray-100">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                  tab === t.key
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
                <span className="mr-1.5 text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5">
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Attendance tab */}
            {tab === "attendance" && (
              attendance.length === 0 ? (
                <p className="text-center py-8 text-gray-400 text-sm">لا توجد سجلات حضور</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-right border-b border-gray-50">
                        {["التاريخ", "الحالة", "ساعات العمل", "الدخول", "الخروج"].map((h) => (
                          <th key={h} className="pb-2 pr-2 font-medium text-gray-500 text-xs">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {attendance.slice(0, 30).map((a) => (
                        <tr key={a.id}>
                          <td className="py-2 pr-2 text-gray-900">{a.date}</td>
                          <td className="py-2 pr-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ATT_COLORS[a.status]}`}>
                              {ATT_LABELS[a.status]}
                            </span>
                          </td>
                          <td className="py-2 pr-2 text-gray-600">{a.worked_hours ?? "—"}</td>
                          <td className="py-2 pr-2 text-gray-500">{a.check_in ?? "—"}</td>
                          <td className="py-2 pr-2 text-gray-500">{a.check_out ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* Advances tab */}
            {tab === "advances" && (
              advances.length === 0 ? (
                <p className="text-center py-8 text-gray-400 text-sm">لا توجد سلف</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-right border-b border-gray-50">
                      {["التاريخ", "الشهر", "المطلوب", "المعتمد", "السبب", "الحالة"].map((h) => (
                        <th key={h} className="pb-2 pr-2 font-medium text-gray-500 text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {advances.map((a) => (
                      <tr key={a.id}>
                        <td className="py-2 pr-2 text-gray-900">{a.advance_date}</td>
                        <td className="py-2 pr-2 text-gray-600">{a.month ?? "—"}</td>
                        <td className="py-2 pr-2">{formatMAD(a.requested_amount)}</td>
                        <td className="py-2 pr-2">{a.approved_amount ? formatMAD(Number(a.approved_amount)) : "—"}</td>
                        <td className="py-2 pr-2 text-gray-500">{a.reason ?? "—"}</td>
                        <td className="py-2 pr-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ADV_COLORS[a.status]}`}>
                            {ADVANCE_STATUS_LABELS[a.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {/* Salaries tab */}
            {tab === "salaries" && (
              salaries.length === 0 ? (
                <p className="text-center py-8 text-gray-400 text-sm">لا توجد كشوفات رواتب</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-right border-b border-gray-50">
                      {["الشهر", "أيام العمل", "الأساسي", "الصافي", "المدفوع", "المتبقي", "الحالة"].map((h) => (
                        <th key={h} className="pb-2 pr-2 font-medium text-gray-500 text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {salaries.map((s) => (
                      <tr key={s.id}>
                        <td className="py-2 pr-2 font-medium text-gray-900">{s.month}</td>
                        <td className="py-2 pr-2 text-gray-600">{Number(s.worked_days).toFixed(1)}</td>
                        <td className="py-2 pr-2">{formatMAD(s.base_salary)}</td>
                        <td className="py-2 pr-2 font-semibold">{formatMAD(s.net_salary)}</td>
                        <td className="py-2 pr-2 text-green-600">{formatMAD(s.paid_amount)}</td>
                        <td className="py-2 pr-2 text-red-500">{formatMAD(s.remaining_amount)}</td>
                        <td className="py-2 pr-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PAY_COLORS[s.payment_status]}`}>
                            {PAYMENT_STATUS_LABELS[s.payment_status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
