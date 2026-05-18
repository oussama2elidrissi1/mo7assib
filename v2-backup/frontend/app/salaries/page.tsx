"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/api";
import type { SalaryCalculation, Employee, Project } from "@/lib/types";
import { PAYMENT_STATUS_LABELS, formatMAD } from "@/lib/types";
import { Calculator, DollarSign } from "lucide-react";

const statusColors: Record<string, string> = {
  unpaid:  "bg-red-100 text-red-800",
  partial: "bg-yellow-100 text-yellow-800",
  paid:    "bg-green-100 text-green-800",
};

export default function SalariesPage() {
  const [salaries, setSalaries] = useState<SalaryCalculation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCalcForm, setShowCalcForm] = useState(false);
  const [showPayForm, setShowPayForm] = useState<number | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [calcForm, setCalcForm] = useState({
    employee_id: "",
    project_id: "",
    month: new Date().toISOString().slice(0, 7),
    overtime_rate: "1.5",
    deductions: "0",
  });

  const load = async () => {
    setLoading(true);
    const [sal, emp, proj] = await Promise.all([
      api.get("/salaries").then((r) => r.data),
      api.get("/employees").then((r) => r.data),
      api.get("/projects").then((r) => r.data),
    ]);
    setSalaries(sal);
    setEmployees(emp);
    setProjects(proj);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const empName = (id: number) => employees.find((e) => e.id === id)?.name ?? `#${id}`;
  const projName = (id: number) => projects.find((p) => p.id === id)?.name ?? `#${id}`;

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/salaries/calculate", {
      employee_id: Number(calcForm.employee_id),
      project_id: Number(calcForm.project_id),
      month: calcForm.month,
      overtime_rate: Number(calcForm.overtime_rate),
      deductions: Number(calcForm.deductions),
    });
    setShowCalcForm(false);
    load();
  };

  const handlePayment = async (id: number) => {
    await api.put(`/salaries/${id}/payment`, { paid_amount: Number(payAmount) });
    setShowPayForm(null);
    setPayAmount("");
    load();
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6" dir="rtl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الرواتب</h1>
          <p className="text-gray-500 text-sm">{salaries.length} كشف راتب</p>
        </div>
        <button
          onClick={() => setShowCalcForm(!showCalcForm)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Calculator size={16} /> حساب راتب
        </button>
      </div>

      {/* Calculation form */}
      {showCalcForm && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6" dir="rtl">
          <h2 className="font-semibold text-gray-800 mb-4">حساب راتب جديد</h2>
          <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
              <select
                required
                value={calcForm.employee_id}
                onChange={(e) => setCalcForm({ ...calcForm, employee_id: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">اختر موظفًا</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المشروع</label>
              <select
                required
                value={calcForm.project_id}
                onChange={(e) => setCalcForm({ ...calcForm, project_id: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">اختر مشروعًا</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الشهر</label>
              <input
                type="month"
                required
                value={calcForm.month}
                onChange={(e) => setCalcForm({ ...calcForm, month: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">معامل الإضافي</label>
              <input
                type="number"
                step="0.1"
                value={calcForm.overtime_rate}
                onChange={(e) => setCalcForm({ ...calcForm, overtime_rate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاستقطاعات (درهم)</label>
              <input
                type="number"
                min="0"
                value={calcForm.deductions}
                onChange={(e) => setCalcForm({ ...calcForm, deductions: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => setShowCalcForm(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:text-gray-900"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                احسب
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto" dir="rtl">
        {loading ? (
          <p className="text-center py-12 text-gray-400 text-sm">جارٍ التحميل...</p>
        ) : salaries.length === 0 ? (
          <p className="text-center py-12 text-gray-400 text-sm">لا توجد كشوفات رواتب. ابدأ بحساب راتب موظف.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["الموظف", "المشروع", "الشهر", "أيام العمل", "الأساسي", "الإضافي", "السلف", "الصافي", "المدفوع", "المتبقي", "الحالة", ""].map((h) => (
                  <th key={h} className="text-right px-3 py-3 font-medium text-gray-600 text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {salaries.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap">{empName(s.employee_id)}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{projName(s.project_id)}</td>
                  <td className="px-3 py-3 text-gray-600">{s.month}</td>
                  <td className="px-3 py-3 text-gray-600">{Number(s.worked_days).toFixed(1)}</td>
                  <td className="px-3 py-3">{formatMAD(s.base_salary)}</td>
                  <td className="px-3 py-3 text-blue-600">{formatMAD(s.overtime_amount)}</td>
                  <td className="px-3 py-3 text-orange-600">-{formatMAD(s.advances_total)}</td>
                  <td className="px-3 py-3 font-semibold text-gray-900">{formatMAD(s.net_salary)}</td>
                  <td className="px-3 py-3 text-green-600">{formatMAD(s.paid_amount)}</td>
                  <td className="px-3 py-3 text-red-600">{formatMAD(s.remaining_amount)}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.payment_status]}`}>
                      {PAYMENT_STATUS_LABELS[s.payment_status]}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {s.payment_status !== "paid" && (
                      showPayForm === s.id ? (
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            className="w-24 border border-gray-200 rounded px-2 py-1 text-xs"
                            placeholder="المبلغ"
                          />
                          <button
                            onClick={() => handlePayment(s.id)}
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          >
                            دفع
                          </button>
                          <button
                            onClick={() => setShowPayForm(null)}
                            className="px-2 py-1 border border-gray-200 rounded text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setShowPayForm(s.id); setPayAmount(String(s.remaining_amount)); }}
                          className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700"
                        >
                          <DollarSign size={14} /> تسجيل دفع
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}
