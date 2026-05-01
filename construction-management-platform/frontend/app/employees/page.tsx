"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppShell from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import DataTable from "@/components/tables/DataTable";
import api from "@/lib/api";
import type { Employee, Project } from "@/lib/types";
import { EMPLOYEE_ROLE_LABELS } from "@/lib/types";
import { Plus } from "lucide-react";

const schema = z.object({
  project_id: z.string().min(1, "Sélectionner un projet"),
  name: z.string().min(1),
  role: z.enum(["engineer", "site_supervisor", "maalem", "worker", "accountant", "other"]),
  phone: z.string().optional(),
  daily_salary: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const load = (pid: string) => {
    if (!pid) return;
    api.get(`/projects/${pid}/employees`).then((r) => setEmployees(r.data));
  };

  useEffect(() => {
    api.get("/projects").then((r) => {
      setProjects(r.data);
      if (r.data.length > 0) { setSelectedProject(String(r.data[0].id)); load(String(r.data[0].id)); }
    });
  }, []);

  async function onSubmit(data: FormData) {
    await api.post("/employees", {
      ...data,
      project_id: parseInt(data.project_id),
      daily_salary: data.daily_salary ? parseFloat(data.daily_salary) : undefined,
    });
    setOpen(false);
    reset();
    load(selectedProject);
  }

  const fmt = (n?: number) => n != null ? `${n} MAD` : "—";

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employés</h1>
        <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-2" />Ajouter</Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-gray-600">Chantier :</span>
        <select value={selectedProject} onChange={(e) => { setSelectedProject(e.target.value); load(e.target.value); }}
          className="border rounded-lg px-3 py-1.5 text-sm">
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <Card>
        <DataTable
          data={employees}
          emptyMessage="Aucun employé sur ce chantier."
          columns={[
            { header: "Nom", accessor: "name" },
            { header: "Rôle", accessor: (e) => EMPLOYEE_ROLE_LABELS[e.role] },
            { header: "Téléphone", accessor: (e) => e.phone || "—" },
            { header: "Salaire/jour", accessor: (e) => fmt(Number(e.daily_salary)) },
            { header: "Statut", accessor: (e) => <Badge label={e.is_active ? "Actif" : "Inactif"} variant={e.is_active ? "green" : "gray"} /> },
          ]}
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter un employé">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Projet *" {...register("project_id")} error={errors.project_id?.message}
            options={projects.map((p) => ({ value: String(p.id), label: p.name }))} />
          <Input label="Nom *" {...register("name")} error={errors.name?.message} />
          <Select label="Rôle *" {...register("role")} error={errors.role?.message}
            options={Object.entries(EMPLOYEE_ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Input label="Téléphone" {...register("phone")} />
          <Input label="Salaire journalier (MAD)" type="number" step="0.01" {...register("daily_salary")} />
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Ajout..." : "Ajouter"}</Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
