"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/api";
import type { Employee, Project } from "@/lib/types";
import { EMPLOYEE_ROLE_LABELS, formatMAD } from "@/lib/types";
import Link from "next/link";
import { Plus, User } from "lucide-react";

const ROLES = Object.entries(EMPLOYEE_ROLE_LABELS) as [string, string][];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", role: "worker", phone: "", cin: "",
    job_title: "", daily_salary: "", hourly_wage: "",
  });

  const load = (pid: string) => {
    if (!pid) return;
    api.get(`/projects/${pid}/employees`).then((r) => setEmployees(r.data));
  };

  useEffect(() => {
    api.get("/projects").then((r) => {
      setProjects(r.data);
      if (r.data.length > 0) {
        setSelectedProject(String(r.data[0].id));
        load(String(r.data[0].id));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/employees", {
      project_id: Number(selectedProject),
      name: form.name,
      role: form.role,
      phone: form.phone || undefined,
      cin: form.cin || undefined,
      job_title: form.job_title || undefined,
      daily_salary: form.daily_salary ? Number(form.daily_salary) : undefined,
      hourly_wage: form.hourly_wage ? Number(form.hourly_wage) : undefined,
    });
    setShowForm(false);
    setForm({ name: "", role: "worker", phone: "", cin: "", job_title: "", daily_salary: "", hourly_wage: "" });
    load(selectedProject);
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6" dir="rtl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الموظفون</h1>
          <p className="text-gray-500 text-sm">{employees.length} موظف</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> إضافة موظف
        </button>
      </div>

      {/* Project filter */}
      <div className="mb-4 flex items-center gap-3" dir="rtl">
        <span className="text-sm text-gray-600">المشروع:</span>
        <select
          value={selectedProject}
          onChange={(e) => { setSelectedProject(e.target.value); load(e.target.value); }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6" dir="rtl">
          <h2 className="font-semibold text-gray-800 mb-4">موظف جديد</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "الاسم الكامل *", key: "name", type: "text", req: true },
              { label: "رقم الهاتف", key: "phone", type: "tel" },
              { label: "رقم CIN", key: "cin", type: "text" },
              { label: "المنصب", key: "job_title", type: "text" },
              { label: "الأجر اليومي (درهم)", key: "daily_salary", type: "number" },
              { label: "أجر الساعة (درهم)", key: "hourly_wage", type: "number" },
            ].map(({ label, key, type, req }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  required={!!req}
                  value={(form as Record<string, string>)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الدور *</label>
              <select
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="md:col-span-3 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900">
                إلغاء
              </button>
              <button type="submit"
                className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                إضافة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employee grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
        {employees.map((e) => (
          <Link key={e.id} href={`/employees/${e.id}`}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{e.name}</p>
                  <p className="text-xs text-gray-500">{EMPLOYEE_ROLE_LABELS[e.role]}</p>
                </div>
                <span className={`mr-auto px-2 py-0.5 rounded-full text-xs font-medium ${
                  e.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {e.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                {e.phone && <p>📞 {e.phone}</p>}
                {e.cin && <p>🪪 {e.cin}</p>}
                {e.job_title && <p>💼 {e.job_title}</p>}
                <p>💰 {formatMAD(e.daily_salary ? Number(e.daily_salary) : undefined)}/يوم</p>
              </div>
            </div>
          </Link>
        ))}
        {employees.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400 text-sm">
            لا يوجد موظفون في هذا المشروع.
          </div>
        )}
      </div>
    </AppShell>
  );
}
