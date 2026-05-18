import Link from "next/link";
import { ArrowLeft, Banknote, ChartNoAxesCombined, Landmark, UserRound } from "lucide-react";

import { Card } from "./Card";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";
import { DashboardProjectCard, PROJECT_STATUS_LABELS, formatMAD, formatPercent } from "@/lib/types";

export default function ProjectCard({ project }: { project: DashboardProjectCard }) {
  return (
    <Card className="group overflow-hidden border border-slate-200/80 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_26px_50px_-28px_rgba(6,26,51,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary-600">{project.city ?? "المغرب"}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">{project.name}</h3>
        </div>
        <StatusBadge status={project.status} label={PROJECT_STATUS_LABELS[project.status]} />
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">نسبة التقدم</span>
          <span className="font-semibold text-slate-900">{formatPercent(project.progress)}</span>
        </div>
        <ProgressBar value={project.progress} tone={project.progress >= 80 ? "green" : "blue"} />
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <div className="flex items-center gap-2">
          <Landmark size={16} />
          <span>الميزانية: {formatMAD(project.budget_prevu)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Banknote size={16} />
          <span>الكلفة: {formatMAD(project.cout_reel)}</span>
        </div>
        <div className="flex items-center gap-2">
          <ChartNoAxesCombined size={16} />
          <span>الهامش المتوقع: {formatMAD(project.marge_estimee)}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserRound size={16} />
          <span>رئيس الورش: {project.chef_chantier ?? "غير معين"}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 px-4 py-3 text-sm">
        <span className="text-slate-500">المرحلة القادمة</span>
        <span className="font-semibold text-slate-900">{project.prochaine_phase ?? "غير محددة"}</span>
      </div>

      <Link href={`/projects/${project.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
        فتح الورش
        <ArrowLeft size={16} />
      </Link>
    </Card>
  );
}
