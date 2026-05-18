"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import api from "@/lib/api";
import {
  EXPENSE_CATEGORY_LABELS,
  Expense,
  PAYMENT_METHOD_LABELS,
  Project,
  formatMAD,
  formatDate,
} from "@/lib/types";

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

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const load = (projectId: string) => {
    if (!projectId) return;
    api.get(`/projects/${projectId}/expenses`).then((response) => setExpenses(response.data));
  };

  useEffect(() => {
    api.get("/projects").then((response) => {
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProject(String(response.data[0].id));
        load(String(response.data[0].id));
      }
    });
  }, []);

  async function onSubmit(data: FormData) {
    await api.post("/expenses", {
      ...data,
      project_id: Number(data.project_id),
      amount: Number(data.amount),
    });
    setOpen(false);
    reset();
    load(selectedProject);
  }

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="مالية الورش"
        title="المصاريف"
        description="تجميع المصاريف حسب المشروع مع تتبع الصنف، المبلغ، وطريقة الأداء."
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">إجمالي المصاريف الحالية</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{formatMAD(total)}</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} className="ml-2" />
          إضافة مصروف
        </Button>
      </div>

      <Card className="mb-6">
        <div className="max-w-sm">
          <label className="mb-1 block text-sm text-slate-500">اختيار الورش</label>
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              load(e.target.value);
            }}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-right text-slate-500">
              {["المصروف", "الصنف", "المبلغ", "التاريخ", "طريقة الأداء", "المورد"].map((header) => (
                <th key={header} className="pb-3 pr-4">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-medium">{expense.title}</td>
                <td className="pr-4">{EXPENSE_CATEGORY_LABELS[expense.category]}</td>
                <td className="pr-4 font-semibold">{formatMAD(Number(expense.amount))}</td>
                <td className="pr-4">{formatDate(expense.expense_date)}</td>
                <td className="pr-4">{PAYMENT_METHOD_LABELS[expense.payment_method]}</td>
                <td className="pr-4">{expense.supplier_name || "—"}</td>
              </tr>
            ))}
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  ما كاين حتى مصروف.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة مصروف">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="المشروع" {...register("project_id")} options={projects.map((project) => ({ value: String(project.id), label: project.name }))} />
          <Input label="العنوان" {...register("title")} error={errors.title?.message} />
          <Select
            label="الصنف"
            {...register("category")}
            options={Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <Input label="المبلغ (MAD)" type="number" step="0.01" {...register("amount")} error={errors.amount?.message} />
          <Input label="التاريخ" type="date" {...register("expense_date")} error={errors.expense_date?.message} />
          <Select
            label="طريقة الأداء"
            {...register("payment_method")}
            options={Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <Input label="المورد" {...register("supplier_name")} />
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جارٍ الحفظ..." : "حفظ المصروف"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
