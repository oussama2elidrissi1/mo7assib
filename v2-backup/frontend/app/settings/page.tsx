"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/api";
import type { User } from "@/lib/types";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    api.get("/auth/me").then((r) => {
      setUser(r.data);
      setForm({ name: r.data.name, email: r.data.email });
    }).catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await api.put(`/users/${user.id}`, { name: form.name });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppShell>
      <div className="mb-6" dir="rtl">
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-500 text-sm">معلومات الحساب والتفضيلات</p>
      </div>

      <div className="max-w-lg" dir="rtl">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">الملف الشخصي</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
              <input
                type="text"
                value={user?.role ?? ""}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
            >
              حفظ التغييرات
            </button>
            {saved && <p className="text-sm text-green-600">تم الحفظ بنجاح ✓</p>}
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-3">معلومات النظام</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">الإصدار</dt>
              <dd className="text-gray-900 font-medium">1.0.0 MVP</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">البيئة</dt>
              <dd className="text-gray-900 font-medium">Development</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">الواجهة الخلفية</dt>
              <dd className="text-gray-900 font-medium">FastAPI + PostgreSQL</dd>
            </div>
          </dl>
        </div>
      </div>
    </AppShell>
  );
}
