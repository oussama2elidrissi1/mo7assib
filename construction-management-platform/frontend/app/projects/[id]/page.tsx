"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge, statusVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import api from "@/lib/api";
import type {
  Project, ProjectLand, Building, Employee, Task, Resource,
  Expense, Document, ProjectProgress, ProjectFinancialSummary,
} from "@/lib/types";
import {
  PROJECT_STATUS_LABELS, EMPLOYEE_ROLE_LABELS, TASK_STATUS_LABELS,
  TASK_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS,
} from "@/lib/types";
import Link from "next/link";
import { Edit } from "lucide-react";

const TABS = [
  "Informations générales", "Terrain", "Bâtiments", "Employés",
  "Pointage", "Tâches", "Achats & Ressources", "Charges",
  "Documents", "Résumé financier",
];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState(0);
  const [project, setProject] = useState<Project | null>(null);
  const [land, setLand] = useState<ProjectLand | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [financial, setFinancial] = useState<ProjectFinancialSummary | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/projects/${id}`).then((r) => setProject(r.data)).catch(() => {});
    api.get(`/projects/${id}/land`).then((r) => setLand(r.data)).catch(() => {});
    api.get(`/projects/${id}/buildings`).then((r) => setBuildings(r.data));
    api.get(`/projects/${id}/employees`).then((r) => setEmployees(r.data));
    api.get(`/projects/${id}/tasks`).then((r) => setTasks(r.data));
    api.get(`/projects/${id}/resources`).then((r) => setResources(r.data));
    api.get(`/projects/${id}/expenses`).then((r) => setExpenses(r.data));
    api.get(`/projects/${id}/documents`).then((r) => setDocuments(r.data));
    api.get(`/projects/${id}/progress`).then((r) => setProgress(r.data));
    api.get(`/projects/${id}/financial-summary`).then((r) => setFinancial(r.data));
  }, [id]);

  const fmt = (n?: number | string) =>
    n != null ? new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(Number(n)) : "—";

  if (!project) return <AppShell><div className="text-gray-400 mt-16 text-center">Chargement...</div></AppShell>;

  return (
    <AppShell>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-500 text-sm">{project.location}</p>
        </div>
        <div className="flex gap-2">
          <Badge label={PROJECT_STATUS_LABELS[project.status]} variant={statusVariant(project.status)} />
          <Link href={`/projects/${id}/edit`}><Button variant="secondary" size="sm"><Edit size={14} className="mr-1" />Modifier</Button></Link>
        </div>
      </div>

      {progress && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Avancement global</span>
            <span className="text-sm font-bold text-primary-700">{progress.progress_percentage}%</span>
          </div>
          <ProgressBar value={progress.progress_percentage} />
          <p className="text-xs text-gray-400 mt-1">{progress.completed_tasks} / {progress.total_tasks} tâches</p>
        </Card>
      )}

      {/* Tab navigation */}
      <div className="flex gap-1 flex-wrap mb-6 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${tab === i ? "border-primary-600 text-primary-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab 0: Informations générales */}
      {tab === 0 && (
        <Card>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {([
              ["Type client", project.client_type === "private" ? "Privé" : "Public"],
              ["Type projet", project.project_type === "labor_only" ? "MO uniquement" : "MO + Matériaux"],
              ["Prix convenu", fmt(project.agreed_price)],
              ["Durée estimée", project.estimated_duration_days ? `${project.estimated_duration_days} jours` : "—"],
              ["Date début", project.start_date || "—"],
              ["Fin estimée", project.estimated_end_date || "—"],
              ["Adresse", project.address || "—"],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k}><dt className="text-gray-500">{k}</dt><dd className="font-medium">{v}</dd></div>
            ))}
          </dl>
        </Card>
      )}

      {/* Tab 1: Terrain */}
      {tab === 1 && (
        <Card>
          {land ? (
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {([
                ["Surface (m²)", land.surface_area_m2 ?? "—"],
                ["Adresse terrain", land.land_address || "—"],
                ["Nombre d'étages", land.floors_count ?? 0],
                ["Sous-sol", land.has_basement ? "Oui" : "Non"],
                ["Nombre de sous-sols", land.basement_count ?? 0],
                ["Notes", land.notes || "—"],
              ] as [string, string | number][]).map(([k, v]) => (
                <div key={k}><dt className="text-gray-500">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
          ) : <p className="text-gray-400">Aucune information terrain saisie.</p>}
        </Card>
      )}

      {/* Tab 2: Bâtiments */}
      {tab === 2 && (
        <Card>
          {buildings.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b">{["Nom", "Surface (m²)", "Étages", "Appartements", "Notes"].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>{buildings.map(b => <tr key={b.id} className="border-b last:border-0"><td className="py-2 pr-4">{b.name}</td><td className="pr-4">{b.surface_area_m2 ?? "—"}</td><td className="pr-4">{b.number_of_floors ?? 0}</td><td className="pr-4">{b.number_of_apartments ?? 0}</td><td>{b.notes || "—"}</td></tr>)}</tbody>
            </table>
          ) : <p className="text-gray-400">Aucun bâtiment saisi.</p>}
        </Card>
      )}

      {/* Tab 3: Employés */}
      {tab === 3 && (
        <Card>
          {employees.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b">{["Nom", "Rôle", "Téléphone", "Salaire/jour", "Statut"].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>{employees.map(e => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{e.name}</td>
                  <td className="pr-4">{EMPLOYEE_ROLE_LABELS[e.role]}</td>
                  <td className="pr-4">{e.phone || "—"}</td>
                  <td className="pr-4">{e.daily_salary ? fmt(Number(e.daily_salary)) : "—"}</td>
                  <td><Badge label={e.is_active ? "Actif" : "Inactif"} variant={e.is_active ? "green" : "gray"} /></td>
                </tr>
              ))}</tbody>
            </table>
          ) : <p className="text-gray-400">Aucun employé sur ce chantier.</p>}
        </Card>
      )}

      {/* Tab 5: Tâches */}
      {tab === 5 && (
        <Card>
          {tasks.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b">{["Titre", "Catégorie", "Priorité", "Statut", "Fin prévue"].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>{tasks.map(t => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{t.title}</td>
                  <td className="pr-4">{TASK_CATEGORY_LABELS[t.category]}</td>
                  <td className="pr-4">{t.priority}</td>
                  <td className="pr-4"><Badge label={TASK_STATUS_LABELS[t.status]} variant={statusVariant(t.status)} /></td>
                  <td>{t.end_date || "—"}</td>
                </tr>
              ))}</tbody>
            </table>
          ) : <p className="text-gray-400">Aucune tâche sur ce chantier.</p>}
        </Card>
      )}

      {/* Tab 6: Ressources */}
      {tab === 6 && (
        <Card>
          {resources.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b">{["Titre", "Type", "Fournisseur", "Montant", "Date"].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>{resources.map(r => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{r.title}</td>
                  <td className="pr-4">{r.type}</td>
                  <td className="pr-4">{r.supplier_name || "—"}</td>
                  <td className="pr-4">{fmt(r.amount)}</td>
                  <td>{r.purchase_date || "—"}</td>
                </tr>
              ))}</tbody>
            </table>
          ) : <p className="text-gray-400">Aucune ressource.</p>}
        </Card>
      )}

      {/* Tab 7: Charges */}
      {tab === 7 && (
        <Card>
          {expenses.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b">{["Titre", "Catégorie", "Montant", "Date", "Mode paiement"].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>{expenses.map(e => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{e.title}</td>
                  <td className="pr-4">{EXPENSE_CATEGORY_LABELS[e.category]}</td>
                  <td className="pr-4">{fmt(Number(e.amount))}</td>
                  <td className="pr-4">{e.expense_date}</td>
                  <td>{e.payment_method}</td>
                </tr>
              ))}</tbody>
            </table>
          ) : <p className="text-gray-400">Aucune charge enregistrée.</p>}
        </Card>
      )}

      {/* Tab 8: Documents */}
      {tab === 8 && (
        <Card>
          {documents.length > 0 ? (
            <ul className="space-y-2">{documents.map(d => (
              <li key={d.id} className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">{d.file_name}</span>
                <a href={`${process.env.NEXT_PUBLIC_API_URL}${d.file_url}`} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline text-xs">Télécharger</a>
              </li>
            ))}</ul>
          ) : <p className="text-gray-400">Aucun document.</p>}
        </Card>
      )}

      {/* Tab 9: Résumé financier */}
      {tab === 9 && financial && (
        <div className="grid grid-cols-2 gap-4">
          {([
            ["Prix convenu", financial.agreed_price],
            ["Charges manuelles", financial.manual_expenses],
            ["Coût main d'œuvre", financial.labor_cost],
            ["Total charges", financial.total_expenses],
            ["Marge estimée", financial.estimated_margin],
          ] as [string, number][]).map(([k, v]) => (
            <Card key={k}>
              <p className="text-sm text-gray-500">{k}</p>
              <p className={`text-2xl font-bold mt-1 ${k === "Marge estimée" && v < 0 ? "text-red-600" : "text-gray-900"}`}>{fmt(v)}</p>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
