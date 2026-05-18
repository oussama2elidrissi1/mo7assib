"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import WizardStepper from "@/components/ui/WizardStepper";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import {
  ASSIGNMENT_ROLE_LABELS,
  CONTRACT_SCOPE_LABELS,
  Employee,
  PHASE_KEY_LABELS,
  ProjectPhaseKey,
  PROJECT_TYPE_LABELS,
  formatMAD,
} from "@/lib/types";

const steps = ["معلومات عامة", "الأرض", "الميزانية", "المراحل", "الفريق", "التأكيد"];

const defaultPhaseKeys: ProjectPhaseKey[] = [
  "earthwork",
  "foundation",
  "structure",
  "electricity",
  "plumbing",
  "plaster",
  "tiling",
  "painting",
  "finishing",
  "delivery",
];

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client_type: "private",
    city: "",
    location: "",
    address: "",
    project_type: "labor_with_materials",
    agreed_price: "",
    start_date: "",
    estimated_duration_days: "",
    description: "",
    surface_area_m2: "",
    floors_count: "",
    has_basement: "false",
    title_reference: "",
    contract_scope: "labor_with_materials",
    terrain_documents: "",
    labor_budget: "",
    materials_budget: "",
    equipment_budget: "",
    other_budget: "",
  });
  const [phaseRows, setPhaseRows] = useState(
    defaultPhaseKeys.map((key, index) => ({
      name: PHASE_KEY_LABELS[key],
      phase_key: key,
      sequence: index + 1,
      status: index === 0 ? "in_progress" : "pending",
      start_date: "",
      end_date: "",
      progress_percentage: index === 0 ? 10 : 0,
      budget_planned: 0,
      actual_cost: 0,
      notes: "",
    })),
  );
  const [selectedTeam, setSelectedTeam] = useState<number[]>([]);
  const [primarySupervisor, setPrimarySupervisor] = useState<number | null>(null);

  useEffect(() => {
    api.get("/employees").then((res) => setEmployees(res.data)).catch(() => {});
  }, []);

  const budgetTotal = useMemo(
    () =>
      ["labor_budget", "materials_budget", "equipment_budget", "other_budget"].reduce(
        (sum, key) => sum + Number(form[key as keyof typeof form] || 0),
        0,
      ),
    [form],
  );
  const estimatedMargin = Number(form.agreed_price || 0) - budgetTotal;
  const selectedEmployeeRows = employees.filter((employee) => selectedTeam.includes(employee.id));

  const next = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  const previous = () => setCurrentStep((step) => Math.max(step - 1, 0));

  async function submitWizard() {
    setSubmitting(true);
    try {
      const endDate =
        form.start_date && form.estimated_duration_days
          ? new Date(
              new Date(form.start_date).getTime() + Number(form.estimated_duration_days) * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .slice(0, 10)
          : undefined;

      const projectResponse = await api.post("/projects", {
        name: form.name,
        client_type: form.client_type,
        city: form.city,
        location: form.city || form.location,
        address: form.address,
        project_type: form.project_type,
        status: "draft",
        agreed_price: Number(form.agreed_price || 0),
        start_date: form.start_date || undefined,
        estimated_end_date: endDate,
        estimated_duration_days: Number(form.estimated_duration_days || 0),
        description: form.description,
      });
      const projectId = projectResponse.data.id;

      await api.put(`/projects/${projectId}/budget`, {
        labor_budget: Number(form.labor_budget || 0),
        materials_budget: Number(form.materials_budget || 0),
        equipment_budget: Number(form.equipment_budget || 0),
        other_budget: Number(form.other_budget || 0),
      });

      await api.post(`/projects/${projectId}/land`, {
        surface_area_m2: Number(form.surface_area_m2 || 0),
        floors_count: Number(form.floors_count || 0),
        has_basement: form.has_basement === "true",
        basement_count: form.has_basement === "true" ? 1 : 0,
        land_address: form.address,
        title_reference: form.title_reference,
        contract_scope: form.contract_scope,
        terrain_documents: form.terrain_documents,
        notes: form.description,
      });

      await api.post(
        `/projects/${projectId}/phases`,
        phaseRows.map((phase) => ({
          ...phase,
          start_date: phase.start_date || null,
          end_date: phase.end_date || null,
        })),
      );

      if (selectedEmployeeRows.length) {
        await api.post(
          `/projects/${projectId}/assign-employees`,
          selectedEmployeeRows.map((employee) => ({
            employee_id: employee.id,
            assignment_role:
              employee.id === primarySupervisor
                ? "site_supervisor"
                : employee.role === "accountant"
                  ? "accountant"
                  : employee.role === "engineer"
                    ? "project_manager"
                    : employee.role,
            daily_salary: Number(employee.daily_salary || 0),
            work_hours_per_day: Number(employee.work_hours_per_day || 8),
            is_primary: employee.id === primarySupervisor,
          })),
        );
      }

      router.push(`/projects/${projectId}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="إنشاء مشروع"
        title="معالج إنشاء ورش جديد"
        description="المشروع خاصو يتبنى على مراحل: معلومات عامة، أرض، ميزانية، مراحل، فريق، ثم تأكيد نهائي."
      />
      <WizardStepper steps={steps} currentStep={currentStep} />

      <div className="mt-8 space-y-6">
        {currentStep === 0 ? (
          <FormSection title="معلومات عامة" description="تعريف المشروع من البداية بطريقة تخدم المحاسبة والتتبع.">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="اسم المشروع" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Select
                label="نوع الزبون"
                value={form.client_type}
                onChange={(e) => setForm({ ...form, client_type: e.target.value })}
                options={[
                  { value: "private", label: "خاص" },
                  { value: "public", label: "عمومي" },
                ]}
              />
              <Input label="المدينة" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value, location: e.target.value })} />
              <Input label="العنوان" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Select
                label="نوع العقد"
                value={form.project_type}
                onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                options={Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
              />
              <Input label="الثمن المتفق عليه" type="number" value={form.agreed_price} onChange={(e) => setForm({ ...form, agreed_price: e.target.value })} />
              <Input label="تاريخ البداية" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              <Input
                label="المدة التقديرية بالأيام"
                type="number"
                value={form.estimated_duration_days}
                onChange={(e) => setForm({ ...form, estimated_duration_days: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Input label="وصف المشروع" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </FormSection>
        ) : null}

        {currentStep === 1 ? (
          <FormSection title="الأرض" description="المعطيات العقارية والتقنية الأساسية ديال القطعة.">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="المساحة م²" type="number" value={form.surface_area_m2} onChange={(e) => setForm({ ...form, surface_area_m2: e.target.value })} />
              <Input label="R+" type="number" value={form.floors_count} onChange={(e) => setForm({ ...form, floors_count: e.target.value })} />
              <Select
                label="قبو"
                value={form.has_basement}
                onChange={(e) => setForm({ ...form, has_basement: e.target.value })}
                options={[
                  { value: "false", label: "بدون قبو" },
                  { value: "true", label: "مع قبو" },
                ]}
              />
              <Input label="الرسم العقاري / المرجع" value={form.title_reference} onChange={(e) => setForm({ ...form, title_reference: e.target.value })} />
              <Select
                label="نطاق العقد"
                value={form.contract_scope}
                onChange={(e) => setForm({ ...form, contract_scope: e.target.value })}
                options={Object.entries(CONTRACT_SCOPE_LABELS).map(([value, label]) => ({ value, label }))}
              />
              <Input
                label="وثائق الأرض"
                value={form.terrain_documents}
                onChange={(e) => setForm({ ...form, terrain_documents: e.target.value })}
              />
            </div>
          </FormSection>
        ) : null}

        {currentStep === 2 ? (
          <FormSection title="الميزانية التقديرية" description="هذه الأرقام هي أساس مراقبة الربحية والتجاوز.">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="ميزانية اليد العاملة" type="number" value={form.labor_budget} onChange={(e) => setForm({ ...form, labor_budget: e.target.value })} />
              <Input label="ميزانية المواد" type="number" value={form.materials_budget} onChange={(e) => setForm({ ...form, materials_budget: e.target.value })} />
              <Input label="ميزانية المعدات" type="number" value={form.equipment_budget} onChange={(e) => setForm({ ...form, equipment_budget: e.target.value })} />
              <Input label="مصاريف أخرى" type="number" value={form.other_budget} onChange={(e) => setForm({ ...form, other_budget: e.target.value })} />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">إجمالي الميزانية</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{formatMAD(budgetTotal)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">الهامش التقديري</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{formatMAD(estimatedMargin)}</p>
              </div>
            </div>
          </FormSection>
        ) : null}

        {currentStep === 3 ? (
          <FormSection title="المراحل" description="المراحل الافتراضية مولدة مسبقا ويمكن تعديل تواريخها وميزانياتها.">
            <div className="space-y-4">
              {phaseRows.map((phase, index) => (
                <div key={phase.phase_key} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-4">
                  <Input
                    label="اسم المرحلة"
                    value={phase.name}
                    onChange={(e) =>
                      setPhaseRows((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, name: e.target.value } : row)))
                    }
                  />
                  <Input
                    label="بداية"
                    type="date"
                    value={phase.start_date}
                    onChange={(e) =>
                      setPhaseRows((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, start_date: e.target.value } : row)))
                    }
                  />
                  <Input
                    label="نهاية"
                    type="date"
                    value={phase.end_date}
                    onChange={(e) =>
                      setPhaseRows((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, end_date: e.target.value } : row)))
                    }
                  />
                  <Input
                    label="ميزانية المرحلة"
                    type="number"
                    value={String(phase.budget_planned)}
                    onChange={(e) =>
                      setPhaseRows((rows) =>
                        rows.map((row, rowIndex) => (rowIndex === index ? { ...row, budget_planned: Number(e.target.value || 0) } : row)),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </FormSection>
        ) : null}

        {currentStep === 4 ? (
          <FormSection title="الفريق" description="اختار رئيس الورش والأعضاء اللي غادي يرتابطو بالمشروع من البداية.">
            <div className="grid gap-3 md:grid-cols-2">
              {employees.map((employee) => {
                const checked = selectedTeam.includes(employee.id);
                const mappedRole = employee.role === "engineer" ? "project_manager" : employee.role;
                return (
                  <label
                    key={employee.id}
                    className={`flex items-center justify-between rounded-2xl border p-4 ${
                      checked ? "border-primary-300 bg-primary-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{employee.name}</p>
                      <p className="text-sm text-slate-500">
                        {ASSIGNMENT_ROLE_LABELS[mappedRole as keyof typeof ASSIGNMENT_ROLE_LABELS] ?? employee.role}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedTeam((rows) => (checked ? rows.filter((item) => item !== employee.id) : [...rows, employee.id]))
                      }
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-5">
              <Select
                label="رئيس الورش"
                value={primarySupervisor ? String(primarySupervisor) : ""}
                onChange={(e) => setPrimarySupervisor(Number(e.target.value))}
                options={selectedEmployeeRows.map((employee) => ({ value: String(employee.id), label: employee.name }))}
              />
            </div>
          </FormSection>
        ) : null}

        {currentStep === 5 ? (
          <FormSection title="التأكيد" description="راجع المعطيات قبل إنشاء المشروع.">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold text-slate-900">{form.name}</p>
                <p className="mt-2 text-slate-500">
                  {form.city} - {form.address}
                </p>
                <p className="mt-2">الثمن المتفق عليه: {formatMAD(Number(form.agreed_price || 0))}</p>
                <p className="mt-2">العقد: {PROJECT_TYPE_LABELS[form.project_type as keyof typeof PROJECT_TYPE_LABELS]}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                <p>إجمالي الميزانية: {formatMAD(budgetTotal)}</p>
                <p className="mt-2">الهامش التقديري: {formatMAD(estimatedMargin)}</p>
                <p className="mt-2">عدد المراحل: {phaseRows.length}</p>
                <p className="mt-2">عدد الأعضاء: {selectedEmployeeRows.length}</p>
              </div>
            </div>
          </FormSection>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={previous} disabled={currentStep === 0}>
          السابق
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={next}>التالي</Button>
        ) : (
          <Button onClick={submitWizard} disabled={submitting}>
            {submitting ? "جارٍ الإنشاء..." : "إنشاء المشروع"}
          </Button>
        )}
      </div>
    </AppShell>
  );
}
