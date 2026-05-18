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
import { Badge, statusVariant } from "@/components/ui/Badge";
import api from "@/lib/api";
import type { Task, Project } from "@/lib/types";
import { TASK_STATUS_LABELS, TASK_CATEGORY_LABELS } from "@/lib/types";
import { Plus } from "lucide-react";

const schema = z.object({
  project_id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["foundation", "structure", "masonry", "plumbing", "electricity", "finishing", "other"]),
  status: z.enum(["todo", "in_progress", "done", "blocked"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const load = (pid: string) => {
    if (!pid) return;
    api.get(`/projects/${pid}/tasks`).then((r) => setTasks(r.data));
  };

  useEffect(() => {
    api.get("/projects").then((r) => {
      setProjects(r.data);
      if (r.data.length > 0) { setSelectedProject(String(r.data[0].id)); load(String(r.data[0].id)); }
    });
  }, []);

  async function onSubmit(data: FormData) {
    await api.post("/tasks", { ...data, project_id: parseInt(data.project_id) });
    setOpen(false);
    reset();
    load(selectedProject);
  }

  const filtered = filterStatus ? tasks.filter((t) => t.status === filterStatus) : tasks;
  const priorityLabel: Record<string, string> = { low: "Basse", medium: "Moyenne", high: "Haute" };

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tâches</h1>
        <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-2" />Nouvelle tâche</Button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={selectedProject} onChange={(e) => { setSelectedProject(e.target.value); load(e.target.value); }}
          className="border rounded-lg px-3 py-1.5 text-sm">
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm">
          <option value="">Tous les statuts</option>
          {Object.entries(TASK_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b">{["Titre", "Catégorie", "Priorité", "Statut", "Début", "Fin"].map(h => <th key={h} className="pb-3 pr-4">{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-medium">{t.title}</td>
                <td className="pr-4">{TASK_CATEGORY_LABELS[t.category]}</td>
                <td className="pr-4">{priorityLabel[t.priority]}</td>
                <td className="pr-4"><Badge label={TASK_STATUS_LABELS[t.status]} variant={statusVariant(t.status)} /></td>
                <td className="pr-4">{t.start_date || "—"}</td>
                <td>{t.end_date || "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">Aucune tâche.</td></tr>}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle tâche">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Projet *" {...register("project_id")} options={projects.map((p) => ({ value: String(p.id), label: p.name }))} />
          <Input label="Titre *" {...register("title")} error={errors.title?.message} />
          <Select label="Catégorie *" {...register("category")} options={Object.entries(TASK_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Statut" {...register("status")} options={Object.entries(TASK_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
            <Select label="Priorité" {...register("priority")} options={[{ value: "low", label: "Basse" }, { value: "medium", label: "Moyenne" }, { value: "high", label: "Haute" }]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Début" type="date" {...register("start_date")} />
            <Input label="Fin" type="date" {...register("end_date")} />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Ajout..." : "Créer"}</Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
