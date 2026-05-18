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
import api from "@/lib/api";
import type { Resource, Project } from "@/lib/types";
import { Plus } from "lucide-react";

const schema = z.object({
  project_id: z.string().min(1),
  type: z.enum(["purchase", "delivery", "material", "equipment"]),
  title: z.string().min(1),
  description: z.string().optional(),
  amount: z.string().optional(),
  supplier_name: z.string().optional(),
  supplier_phone: z.string().optional(),
  purchase_date: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const TYPE_LABELS: Record<string, string> = {
  purchase: "Achat", delivery: "Livraison", material: "Matériau", equipment: "Équipement",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const load = (pid: string) => {
    if (!pid) return;
    api.get(`/projects/${pid}/resources`).then((r) => setResources(r.data));
  };

  useEffect(() => {
    api.get("/projects").then((r) => {
      setProjects(r.data);
      if (r.data.length > 0) { setSelectedProject(String(r.data[0].id)); load(String(r.data[0].id)); }
    });
  }, []);

  async function onSubmit(data: FormData) {
    await api.post("/resources", {
      ...data,
      project_id: parseInt(data.project_id),
      amount: data.amount ? parseFloat(data.amount) : undefined,
    });
    setOpen(false);
    reset();
    load(selectedProject);
  }

  const fmt = (n?: number) => n != null ? `${Number(n).toLocaleString("fr-MA")} MAD` : "—";

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Achats & Ressources</h1>
        <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-2" />Ajouter</Button>
      </div>

      <div className="mb-4">
        <select value={selectedProject} onChange={(e) => { setSelectedProject(e.target.value); load(e.target.value); }}
          className="border rounded-lg px-3 py-1.5 text-sm">
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b">{["Titre", "Type", "Fournisseur", "Téléphone", "Montant", "Date"].map(h => <th key={h} className="pb-3 pr-4">{h}</th>)}</tr></thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-medium">{r.title}</td>
                <td className="pr-4">{TYPE_LABELS[r.type]}</td>
                <td className="pr-4">{r.supplier_name || "—"}</td>
                <td className="pr-4">{r.supplier_phone || "—"}</td>
                <td className="pr-4">{fmt(Number(r.amount))}</td>
                <td>{r.purchase_date || "—"}</td>
              </tr>
            ))}
            {resources.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">Aucune ressource.</td></tr>}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter une ressource">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Projet *" {...register("project_id")} options={projects.map((p) => ({ value: String(p.id), label: p.name }))} />
          <Select label="Type *" {...register("type")} options={Object.entries(TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Input label="Titre *" {...register("title")} error={errors.title?.message} />
          <Input label="Montant (MAD)" type="number" step="0.01" {...register("amount")} />
          <Input label="Fournisseur" {...register("supplier_name")} />
          <Input label="Téléphone fournisseur" {...register("supplier_phone")} />
          <Input label="Date d'achat" type="date" {...register("purchase_date")} />
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Ajout..." : "Ajouter"}</Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
