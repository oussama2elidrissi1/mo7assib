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
import type { Expense, Project } from "@/lib/types";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/types";
import { Plus } from "lucide-react";

const schema = z.object({
  project_id: z.string().min(1),
  category: z.enum(["labor", "materials", "transport", "equipment", "admin", "other"]),
  title: z.string().min(1),
  amount: z.string().min(1),
  expense_date: z.string().min(1),
  payment_method: z.enum(["cash", "bank_transfer", "check", "card", "other"]).default("cash"),
  supplier_name: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Espèces", bank_transfer: "Virement", check: "Chèque", card: "Carte", other: "Autre",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const load = (pid: string) => {
    if (!pid) return;
    api.get(`/projects/${pid}/expenses`).then((r) => setExpenses(r.data));
  };

  useEffect(() => {
    api.get("/projects").then((r) => {
      setProjects(r.data);
      if (r.data.length > 0) { setSelectedProject(String(r.data[0].id)); load(String(r.data[0].id)); }
    });
  }, []);

  async function onSubmit(data: FormData) {
    await api.post("/expenses", {
      ...data, project_id: parseInt(data.project_id), amount: parseFloat(data.amount),
    });
    setOpen(false);
    reset();
    load(selectedProject);
  }

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const fmt = (n: number) => new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(n);

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Charges</h1>
          {expenses.length > 0 && <p className="text-sm text-gray-500">Total: <strong>{fmt(total)}</strong></p>}
        </div>
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
          <thead><tr className="text-left text-gray-500 border-b">{["Titre", "Catégorie", "Montant", "Date", "Mode paiement", "Fournisseur"].map(h => <th key={h} className="pb-3 pr-4">{h}</th>)}</tr></thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-medium">{e.title}</td>
                <td className="pr-4">{EXPENSE_CATEGORY_LABELS[e.category]}</td>
                <td className="pr-4 font-semibold">{fmt(Number(e.amount))}</td>
                <td className="pr-4">{e.expense_date}</td>
                <td className="pr-4">{PAYMENT_LABELS[e.payment_method]}</td>
                <td>{e.supplier_name || "—"}</td>
              </tr>
            ))}
            {expenses.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">Aucune charge.</td></tr>}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter une charge">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Projet *" {...register("project_id")} options={projects.map((p) => ({ value: String(p.id), label: p.name }))} />
          <Input label="Titre *" {...register("title")} error={errors.title?.message} />
          <Select label="Catégorie *" {...register("category")} options={Object.entries(EXPENSE_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Input label="Montant (MAD) *" type="number" step="0.01" {...register("amount")} error={errors.amount?.message} />
          <Input label="Date *" type="date" {...register("expense_date")} error={errors.expense_date?.message} />
          <Select label="Mode de paiement" {...register("payment_method")} options={Object.entries(PAYMENT_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Input label="Fournisseur" {...register("supplier_name")} />
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Ajout..." : "Ajouter"}</Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
