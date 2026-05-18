"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/api";
import type { Advance, Employee, Project } from "@/lib/types";
import { ADVANCE_STATUS_LABELS, formatMAD } from "@/lib/types";
import { Plus, CheckCircle, XCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdvancesPage() {
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    employee_id: "",
    project_id: "",
    requested_amount: "",
    reason: "",
    advance_date: new Date().toISOString().slice(0, 10),
    month: new Date().toISOString().slice(0, 7),
  });

  const load = async () => {
    setLoading(true);
    const [adv, emp, proj] = await Promise.all([
      api.get("/advances").then((r) => r.data),
      api.get("/employees").then((r) => r.data),
      api.get("/projects").then((r) => r.data),
    ]);
    setAdvances(adv);
    setEmployees(emp);
    setProjects(proj);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const empName = (id: number) => employees.find((e) => e.id === id)?.name ?? id;
  const projName = (id: number) => projects.find((p) => p.id === id)?.name ?? id;

  const handleApprove = async (id: number) => {
    await api.put(`/advances/${id}`, { status: "approved" });
    load();
  };
  const handleReject = async (id: number) => {
    await api.put(`/advances/${id}`, { status: "rejected" });
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/advances", {
      ...form,
      employee_id: Number(form.employee_id),
      project_id: Number(form.project_id),
      requested_amount: Number(form.requested_amount),
    });
    setShowForm(false);
    setForm({ employee_id: "", project_id: "", requested_amount: "", reason: "", advance_date: new Date().toISOString().slice(0, 10), month: new Date().toISOString().slice(0, 7) });
    load();
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6" dir="rtl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">السلف</h1>
          <p className="text-gray-500 text-sm">{advances.length} طلب</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> طلب سلفة
        </button>
      </div>

      {/* New advance form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6" dir="rtl">
          <h2 className="font-semibold text-gray-800 mb-4">طلب سلفة جديدة</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
              <select
                required
                value={form.employee_id}
                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
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
                value={form.project_id}
                onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">اختر مشروعًا</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ المطلوب (درهم)</label>
              <input
                type="number"
                required
                min="1"
                value={form.requested_amount}
                onChange={(e) => setForm({ ...form, requested_amount: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الشهر</label>
              <input
                type="month"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الطلب</label>
              <input
                type="date"
                required
                value={form.advance_date}
                onChange={(e) => setForm({ ...form, advance_date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السبب</label>
              <input
                type="text"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="اختياري"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                إرسال الطلب
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" dir="rtl">
        {loading ? (
          <p className="text-center py-12 text-gray-400 text-sm">جارٍ التحميل...</p>
        ) : advances.length === 0 ? (
          <p className="text-center py-12 text-gray-400 text-sm">لا توجد طلبات سلف</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["الموظف", "المشروع", "المبلغ المطلوب", "المبلغ المعتمد", "الشهر", "التاريخ", "الحالة", "إجراءات"].map((h) => (
                  <th key={h} className="text-right px-4 py-3 font-medium text-gray-600 text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {advances.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{empName(a.employee_id)}</td>
                  <td className="px-4 py-3 text-gray-600">{projName(a.project_id)}</td>
                  <td className="px-4 py-3 text-gray-900">{formatMAD(a.requested_amount)}</td>
                  <td className="px-4 py-3 text-gray-600">{a.approved_amount ? formatMAD(a.approved_amount) : "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{a.month ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{a.advance_date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status]}`}>
                      {ADVANCE_STATUS_LABELS[a.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {a.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(a.id)}
                          className="text-green-600 hover:text-green-800"
                          title="قبول"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(a.id)}
                          className="text-red-500 hover:text-red-700"
                          title="رفض"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
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
