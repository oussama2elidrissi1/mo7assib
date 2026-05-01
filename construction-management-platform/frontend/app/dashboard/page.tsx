"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/Card";
import api from "@/lib/api";
import type { DashboardData, Project } from "@/lib/types";
import { PROJECT_STATUS_LABELS } from "@/lib/types";
import { Badge, statusVariant } from "@/components/ui/Badge";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.get("/dashboard").then((r) => setStats(r.data));
    api.get("/projects?limit=5").then((r) => setProjects(r.data));
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(n);

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm">Vue d'ensemble de vos chantiers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total chantiers" value={stats?.total_projects ?? "—"} />
        <StatCard label="Chantiers actifs" value={stats?.active_projects ?? "—"} />
        <StatCard label="Chantiers terminés" value={stats?.finished_projects ?? "—"} />
        <StatCard label="Total charges" value={stats ? fmt(Number(stats.total_expenses)) : "—"} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Chantiers récents</h2>
          <Link href="/projects" className="text-sm text-primary-600 hover:underline">Voir tous</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">{p.location}</p>
              </div>
              <div className="flex items-center gap-4">
                {p.agreed_price && (
                  <span className="text-sm text-gray-600">{fmt(Number(p.agreed_price))}</span>
                )}
                <Badge label={PROJECT_STATUS_LABELS[p.status]} variant={statusVariant(p.status)} />
              </div>
            </Link>
          ))}
          {projects.length === 0 && (
            <p className="text-center text-gray-400 py-8">Aucun chantier pour l'instant.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
