"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/api";
import type { Project, ProjectFinancialSummary } from "@/lib/types";
import { formatMAD } from "@/lib/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ProjectReport {
  project: Project;
  summary: ProjectFinancialSummary | null;
  progress: { progress_percentage: number; total_tasks: number; completed_tasks: number } | null;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const projects: Project[] = await api.get("/projects").then((r) => r.data);
      const results = await Promise.all(
        projects.map(async (p) => {
          const [summary, progress] = await Promise.all([
            api.get(`/projects/${p.id}/financial-summary`).then((r) => r.data).catch(() => null),
            api.get(`/projects/${p.id}/progress`).then((r) => r.data).catch(() => null),
          ]);
          return { project: p, summary, progress };
        })
      );
      setReports(results);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AppShell>
      <div className="mb-6" dir="rtl">
        <h1 className="text-2xl font-bold text-gray-900">التقارير</h1>
        <p className="text-gray-500 text-sm">الملخص المالي والتقدم لكل مشروع</p>
      </div>

      {loading ? (
        <p className="text-center py-16 text-gray-400">جارٍ التحميل...</p>
      ) : (
        <div className="space-y-4" dir="rtl">
          {reports.map(({ project: p, summary, progress }) => {
            const margin = summary?.estimated_margin ?? 0;
            const positive = margin >= 0;
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">{p.name}</h2>
                    <p className="text-sm text-gray-500">{p.location} · {p.status}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
                    {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {formatMAD(margin)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">السعر المتفق عليه</p>
                    <p className="font-semibold text-gray-900">{formatMAD(summary?.agreed_price)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">المصاريف الإجمالية</p>
                    <p className="font-semibold text-orange-600">{formatMAD(summary?.total_expenses)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">تكلفة اليد العاملة</p>
                    <p className="font-semibold text-blue-600">{formatMAD(summary?.labor_cost)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">الهامش التقديري</p>
                    <p className={`font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
                      {formatMAD(summary?.estimated_margin)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">تقدم المهام</p>
                    {progress ? (
                      <div>
                        <p className="font-semibold text-gray-900">{progress.progress_percentage}%</p>
                        <p className="text-xs text-gray-400">{progress.completed_tasks}/{progress.total_tasks} مهمة</p>
                      </div>
                    ) : (
                      <p className="font-semibold text-gray-400">—</p>
                    )}
                  </div>
                </div>

                {progress && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${progress.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {reports.length === 0 && (
            <p className="text-center py-16 text-gray-400 text-sm">لا توجد مشاريع لعرض تقاريرها.</p>
          )}
        </div>
      )}
    </AppShell>
  );
}
