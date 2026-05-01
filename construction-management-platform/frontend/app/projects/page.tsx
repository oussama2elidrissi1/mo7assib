"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { PROJECT_STATUS_LABELS } from "@/lib/types";
import type { Project } from "@/lib/types";
import api from "@/lib/api";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => { api.get("/projects").then((r) => setProjects(r.data)); }, []);

  const fmt = (n?: number) => n
    ? new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(n)
    : "—";

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chantiers</h1>
          <p className="text-gray-500 text-sm">{projects.length} projet(s)</p>
        </div>
        <Link href="/projects/new">
          <Button><Plus size={16} className="mr-2" />Nouveau chantier</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {projects.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.location} — {p.address || ""}</p>
                </div>
                <Badge label={PROJECT_STATUS_LABELS[p.status]} variant={statusVariant(p.status)} />
              </div>
              <div className="flex gap-6 mt-3 text-sm text-gray-600">
                <span>Prix convenu: <strong>{fmt(p.agreed_price)}</strong></span>
                {p.start_date && <span>Début: {p.start_date}</span>}
                {p.estimated_end_date && <span>Fin estimée: {p.estimated_end_date}</span>}
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>Aucun chantier. Créez votre premier projet.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
