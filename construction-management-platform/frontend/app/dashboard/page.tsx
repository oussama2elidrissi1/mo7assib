"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Coins,
  PiggyBank,
  Receipt,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import AlertCard from "@/components/ui/AlertCard";
import ProjectCard from "@/components/ui/ProjectCard";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";
import { DashboardSummary, EXPENSE_CATEGORY_LABELS, formatMAD } from "@/lib/types";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api.get("/dashboard/summary").then((response) => setSummary(response.data)).catch(() => {});
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="لوحة القيادة"
        title={`سلام ${summary?.greeting_name ?? ""}`}
        description="هنا كتلقى نظرة شاملة على المشاريع النشطة، التنبيهات المهمة، الحركة اليومية، والوضعية المالية باش القرار يبقى واضح وسريع."
        actions={[
          { href: "/projects/new", label: "إنشاء مشروع" },
          { href: "/expenses", label: "إضافة مصروف", variant: "secondary" },
          { href: "/attendance", label: "النقطة اليومية", variant: "secondary" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="المشاريع النشطة" value={summary?.active_projects ?? "—"} icon={BriefcaseBusiness} />
        <StatCard title="المشاريع المتأخرة" value={summary?.delayed_projects ?? "—"} icon={AlertTriangle} accent="red" />
        <StatCard title="الميزانية الملتزم بها" value={formatMAD(summary?.budget_total_engaged)} icon={PiggyBank} accent="yellow" />
        <StatCard title="الكلفة الحقيقية" value={formatMAD(summary?.cout_reel_total)} icon={Wallet} />
        <StatCard title="الهامش التقديري" value={formatMAD(summary?.marge_estimee_total)} icon={Coins} accent="green" />
        <StatCard title="مصاريف هذا الشهر" value={formatMAD(summary?.depenses_mois)} icon={Receipt} />
        <StatCard title="رواتب خاصها الأداء" value={formatMAD(summary?.salaires_a_payer)} icon={Users} accent="red" />
        <StatCard title="الحضور اليوم" value={summary?.employes_presents_aujourdhui ?? "—"} icon={Wrench} accent="green" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">التنبيهات المهمة</h2>
              <p className="text-sm text-slate-500">الملفات اللي خاصها تدخل سريع قبل ما تتحول لمشكل تشغيلي أو مالي.</p>
            </div>
          </div>
          <div className="grid gap-4">
            {summary?.alerts?.length ? (
              summary.alerts.map((alert) => <AlertCard key={`${alert.code}-${alert.title}`} alert={alert} />)
            ) : (
              <Card>
                <p className="text-sm text-slate-500">ما كايناش تنبيهات حرجة حاليا.</p>
              </Card>
            )}
          </div>
        </section>

        <Card className="overflow-hidden bg-primary-900 text-white">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary-200">نشاط اليوم</p>
          <h2 className="mt-2 text-2xl font-bold">الحركة اليومية داخل الأوراش</h2>
          <div className="mt-6 space-y-3">
            {summary?.today_activity?.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                <span className="text-sm text-primary-100">{item.label}</span>
                <span className="text-lg font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-950">الأوراش النشطة</h2>
          <p className="text-sm text-slate-500">كل ورش كيبين الحالة، الكلفة، الهامش، المرحلة القادمة، والمسؤول الميداني.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {summary?.active_site_cards?.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="text-xl font-bold text-slate-950">الميزانية مقابل الكلفة الحقيقية</h2>
          <div className="mt-6 space-y-5">
            {summary?.finance_quick?.budget_vs_actual?.map((item) => {
              const max = Math.max(item.budget, item.actual, 1);
              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">{item.label}</span>
                    <span className="text-slate-500">
                      {formatMAD(item.actual)} / {formatMAD(item.budget)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-slate-100">
                      <div className="h-3 rounded-full bg-primary-700" style={{ width: `${(item.budget / max) * 100}%` }} />
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div className="h-3 rounded-full bg-accent-500" style={{ width: `${(item.actual / max) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-950">توزيع المصاريف</h2>
          <div className="mt-6 space-y-4">
            {summary?.finance_quick?.expenses_distribution?.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{EXPENSE_CATEGORY_LABELS[item.label as keyof typeof EXPENSE_CATEGORY_LABELS] ?? item.label}</span>
                  <span className="font-semibold text-slate-900">{formatMAD(item.amount)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-l from-primary-600 to-accent-500"
                    style={{ width: `${Math.min(Number(item.amount) / 100000, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-base font-bold text-slate-950">أكثر 3 مشاريع تكلفة</h3>
            <div className="mt-4 space-y-3">
              {summary?.finance_quick?.top_cost_projects?.map((project) => (
                <div key={project.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{project.name}</p>
                      <p className="text-xs text-slate-500">{project.city}</p>
                    </div>
                    <strong className="text-sm text-slate-900">{formatMAD(project.cout_reel)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
