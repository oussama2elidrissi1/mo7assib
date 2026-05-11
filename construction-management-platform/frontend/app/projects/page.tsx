"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import ProjectCard from "@/components/ui/ProjectCard";
import EmptyState from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";
import { DashboardProjectCard, ProjectOverview } from "@/lib/types";

const scopeDescriptions: Record<string, string> = {
  all: "عرض جميع المشاريع",
  active: "عرض المشاريع النشطة",
  delayed: "عرض المشاريع المتأخرة",
  closed: "عرض المشاريع المغلقة",
};

export default function ProjectsPage() {
  const params = useSearchParams();
  const scope = params.get("scope") ?? "all";
  const [projects, setProjects] = useState<ProjectOverview[]>([]);

  useEffect(() => {
    api.get("/projects").then(async (response) => {
      const rows = response.data as { id: number }[];
      const details = await Promise.all(rows.map((row) => api.get(`/projects/${row.id}/overview`).then((res) => res.data)));
      setProjects(details);
    }).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (scope === "active") return projects.filter((project) => project.status === "active");
    if (scope === "closed") return projects.filter((project) => ["finished", "archived"].includes(project.status));
    if (scope === "delayed") return projects.filter((project) => project.alerts.some((alert) => alert.code === "phase_delayed"));
    return projects;
  }, [projects, scope]);

  const cards: DashboardProjectCard[] = filtered.map((project) => ({
    id: project.id,
    name: project.name,
    city: project.city,
    status: project.status,
    progress: project.taux_avancement,
    budget_prevu: project.budget_prevu,
    cout_reel: project.cout_reel,
    marge_estimee: project.marge_estimee,
    prochaine_phase: project.prochaine_phase,
    chef_chantier: project.chef_chantier,
  }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="المشاريع"
        title="محفظة المشاريع"
        description="هنا كتلقى كل الأوراش بتصنيف واضح حسب الحالة، التأخير، والجاهزية المالية."
        actions={[{ href: "/projects/new", label: "إنشاء مشروع" }]}
      />

      <Card className="mb-6 flex flex-wrap items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-700">
          <Search size={18} />
        </div>
        <div>
          <p className="font-semibold text-slate-900">الفلاتر الجاهزة</p>
          <p className="text-sm text-slate-500">{scopeDescriptions[scope] ?? scopeDescriptions.all}</p>
        </div>
        <Link href="/projects/new" className="mr-auto">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-primary-900 px-4 py-2 text-sm font-semibold text-white">
            <Plus size={16} />
            مشروع جديد
          </span>
        </Link>
      </Card>

      {cards.length ? (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {cards.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="ما كاين حتى مشروع مطابق"
          description="بدل الفلتر أو أنشئ مشروع جديد باش تبدأ تدبير دورة حياة الورش."
        />
      )}
    </AppShell>
  );
}
