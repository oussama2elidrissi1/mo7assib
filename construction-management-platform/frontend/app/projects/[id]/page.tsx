"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FileImage,
  HardHat,
  Landmark,
  MapPinned,
  ReceiptText,
  ScrollText,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import ProjectTabs from "@/components/ui/ProjectTabs";
import AlertCard from "@/components/ui/AlertCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import EmptyState from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import DataTable from "@/components/tables/DataTable";
import api from "@/lib/api";
import {
  ASSIGNMENT_ROLE_LABELS,
  ATTENDANCE_STATUS_LABELS,
  CONTRACT_SCOPE_LABELS,
  DELIVERY_STATUS_LABELS,
  EXPENSE_CATEGORY_LABELS,
  PAYMENT_STATUS_LABELS,
  PHASE_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  RELATED_TYPE_LABELS,
  Attendance,
  Building,
  DailySiteReport,
  Expense,
  MaterialDelivery,
  ProjectAssignment,
  ProjectDocument,
  ProjectFinancialSummary,
  ProjectLand,
  ProjectOverview,
  ProjectPhase,
  ProjectSalarySummary,
  formatDate,
  formatMAD,
  formatPercent,
} from "@/lib/types";

const tabs = ["نظرة عامة", "الأرض", "التخطيط والمراحل", "الفريق", "النقطة", "المصاريف", "الموارد", "الرواتب", "الوثائق", "التقارير"];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [overview, setOverview] = useState<ProjectOverview | null>(null);
  const [land, setLand] = useState<ProjectLand | null>(null);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [team, setTeam] = useState<ProjectAssignment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [financial, setFinancial] = useState<ProjectFinancialSummary | null>(null);
  const [salarySummary, setSalarySummary] = useState<ProjectSalarySummary | null>(null);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [dailyReport, setDailyReport] = useState<DailySiteReport | null>(null);
  const [deliveries, setDeliveries] = useState<MaterialDelivery[]>([]);

  useEffect(() => {
    if (!id) return;
    api.get(`/projects/${id}/overview`).then((res) => setOverview(res.data)).catch(() => {});
    api.get(`/projects/${id}/land`).then((res) => setLand(res.data)).catch(() => setLand(null));
    api.get(`/projects/${id}/phases`).then((res) => setPhases(res.data)).catch(() => {});
    api.get(`/projects/${id}/team`).then((res) => setTeam(res.data)).catch(() => {});
    api.get(`/attendance/project/${id}`).then((res) => setAttendance(res.data)).catch(() => {});
    api.get(`/projects/${id}/expenses`).then((res) => setExpenses(res.data)).catch(() => {});
    api.get(`/projects/${id}/financial-summary`).then((res) => setFinancial(res.data)).catch(() => {});
    api.get(`/projects/${id}/salary-summary`).then((res) => setSalarySummary(res.data)).catch(() => {});
    api.get(`/projects/${id}/documents-v2`).then((res) => setDocuments(res.data)).catch(() => {});
    api.get(`/projects/${id}/buildings`).then((res) => setBuildings(res.data)).catch(() => {});
    api.get(`/projects/${id}/daily-report`).then((res) => setDailyReport(res.data)).catch(() => {});
    api.get(`/projects/${id}/material-deliveries`).then((res) => setDeliveries(res.data)).catch(() => {});
  }, [id]);

  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = attendance.filter((item) => item.date === today);

  if (!overview) {
    return (
      <AppShell>
        <Card>
          <p className="text-sm text-slate-500">جارٍ تحميل مركز قيادة الورش...</p>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="مركز قيادة المشروع"
        title={overview.name}
        description="هذه الصفحة هي مركز القرار ديال الورش: التقدم، الفريق، النقطة، المصاريف، الموارد، الرواتب والوثائق كلهم مجتمعين هنا."
        actions={[
          { href: "/attendance", label: "النقطة اليومية", variant: "secondary" },
          { href: "/expenses", label: "إضافة مصروف", variant: "secondary" },
          { href: "/documents", label: "إضافة وثيقة", variant: "secondary" },
        ]}
      />

      <div className="mb-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden bg-primary-900 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-primary-200">{overview.city ?? overview.location}</p>
              <h2 className="mt-2 text-3xl font-bold">{overview.name}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-primary-100">
                {overview.description ?? "لا توجد ملاحظات إضافية على المشروع حاليا."}
              </p>
            </div>
            <StatusBadge status={overview.status} label={PROJECT_STATUS_LABELS[overview.status]} />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-primary-200">التقدم العام</span>
              <span className="font-semibold">{formatPercent(overview.taux_avancement)}</span>
            </div>
            <ProgressBar value={overview.taux_avancement} tone="yellow" />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-primary-200">الميزانية</p>
              <p className="mt-2 font-bold">{formatMAD(overview.budget_prevu)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-primary-200">الكلفة</p>
              <p className="mt-2 font-bold">{formatMAD(overview.cout_reel)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-primary-200">الهامش الحقيقي</p>
              <p className="mt-2 font-bold">{formatMAD(overview.marge_reelle)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-primary-200">المرحلة القادمة</p>
              <p className="mt-2 font-bold">{overview.prochaine_phase ?? "غير محددة"}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {overview.alerts.length ? (
            overview.alerts.slice(0, 3).map((alert) => <AlertCard key={`${alert.code}-${alert.title}`} alert={alert} />)
          ) : (
            <Card>
              <p className="text-sm text-slate-500">ما كايناش تنبيهات حرجة دابا.</p>
            </Card>
          )}
        </div>
      </div>

      <ProjectTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 0 ? (
        <div className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-4">
            <Card>
              <p className="text-sm text-slate-500">الوضعية العامة</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex justify-between"><span>الثمن المتفق عليه</span><strong>{formatMAD(overview.agreed_price)}</strong></div>
                <div className="flex justify-between"><span>رئيس الورش</span><strong>{overview.chef_chantier ?? "غير معين"}</strong></div>
                <div className="flex justify-between"><span>مدير المشروع</span><strong>{overview.project_manager ?? "غير معين"}</strong></div>
                <div className="flex justify-between"><span>تجاوز الميزانية</span><strong>{formatPercent(overview.taux_depassement_budget)}</strong></div>
              </div>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">الميزانية الأولية</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span>اليد العاملة</span><strong>{formatMAD(overview.budget?.labor_budget)}</strong></div>
                <div className="flex justify-between"><span>المواد</span><strong>{formatMAD(overview.budget?.materials_budget)}</strong></div>
                <div className="flex justify-between"><span>المعدات</span><strong>{formatMAD(overview.budget?.equipment_budget)}</strong></div>
                <div className="flex justify-between"><span>أخرى</span><strong>{formatMAD(overview.budget?.other_budget)}</strong></div>
              </div>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">الموارد والتتبع</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span>أعضاء الفريق</span><strong>{overview.team_count}</strong></div>
                <div className="flex justify-between"><span>الحضور اليوم</span><strong>{overview.present_today_count}</strong></div>
                <div className="flex justify-between"><span>الغيابات اليوم</span><strong>{overview.absent_today_count}</strong></div>
                <div className="flex justify-between"><span>التسليمات المعتمدة</span><strong>{overview.validated_deliveries_count}</strong></div>
              </div>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">التنبيهات السريعة</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span>مراحل متأخرة</span><strong>{overview.delayed_phases_count}</strong></div>
                <div className="flex justify-between"><span>مصاريف غير مصادق عليها</span><strong>{overview.pending_expenses_count}</strong></div>
                <div className="flex justify-between"><span>الوثائق</span><strong>{overview.documents_count}</strong></div>
                <div className="flex justify-between"><span>الهامش التقديري</span><strong>{formatMAD(overview.marge_estimee)}</strong></div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">تاريخ البداية</p>
                <p className="mt-1 font-semibold text-slate-900">{formatDate(overview.start_date)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">تاريخ النهاية المتوقع</p>
                <p className="mt-1 font-semibold text-slate-900">{formatDate(overview.estimated_end_date)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">المدينة</p>
                <p className="mt-1 font-semibold text-slate-900">{overview.city ?? overview.location}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">العنوان</p>
                <p className="mt-1 font-semibold text-slate-900">{overview.address ?? "—"}</p>
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === 1 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <MapPinned size={18} className="text-primary-700" />
              <h3 className="text-lg font-semibold">الأرض</h3>
            </div>
            {land ? (
              <div className="grid gap-3 text-sm text-slate-700">
                <div className="flex justify-between"><span>المساحة</span><strong>{land.surface_area_m2 ?? "—"} م²</strong></div>
                <div className="flex justify-between"><span>العنوان</span><strong>{land.land_address ?? "—"}</strong></div>
                <div className="flex justify-between"><span>الرسم العقاري</span><strong>{land.title_reference ?? "—"}</strong></div>
                <div className="flex justify-between"><span>R+</span><strong>{land.floors_count ?? "—"}</strong></div>
                <div className="flex justify-between"><span>قبو</span><strong>{land.has_basement ? "نعم" : "لا"}</strong></div>
                <div className="flex justify-between"><span>نطاق العقد</span><strong>{CONTRACT_SCOPE_LABELS[land.contract_scope ?? ""] ?? "—"}</strong></div>
                <div>
                  <p className="text-slate-500">وثائق الأرض</p>
                  <p className="mt-1 font-medium text-slate-900">{land.terrain_documents ?? "—"}</p>
                </div>
              </div>
            ) : (
              <EmptyState icon={MapPinned} title="ما كايناش بيانات الأرض" description="كمل معلومات الأرض باش يبقى المشروع منظم من البداية." />
            )}
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <Landmark size={18} className="text-primary-700" />
              <h3 className="text-lg font-semibold">البنايات والبلوكات</h3>
            </div>
            <DataTable
              data={buildings}
              emptyMessage="ما كاين حتى بلوك مسجل."
              columns={[
                { header: "الاسم", accessor: "name" },
                { header: "الطوابق", accessor: (row) => row.number_of_floors ?? "—" },
                { header: "الشقق / اللوط", accessor: (row) => row.number_of_apartments ?? "—" },
                { header: "المساحة", accessor: (row) => `${row.surface_area_m2 ?? "—"} م²` },
              ]}
            />
          </Card>
        </div>
      ) : null}

      {activeTab === 2 ? (
        <DataTable
          data={phases}
          emptyMessage="ما كاين حتى مرحلة مسجلة."
          columns={[
            { header: "المرحلة", accessor: "name" },
            { header: "الحالة", accessor: (row) => <StatusBadge status={row.status} label={PHASE_STATUS_LABELS[row.status]} /> },
            {
              header: "التقدم",
              accessor: (row) => (
                <div className="w-44">
                  <div className="mb-1 text-xs">{formatPercent(row.progress_percentage)}</div>
                  <ProgressBar value={row.progress_percentage} tone={row.is_delayed ? "red" : "blue"} />
                </div>
              ),
            },
            { header: "الميزانية", accessor: (row) => formatMAD(row.budget_planned) },
            { header: "الكلفة", accessor: (row) => formatMAD(row.actual_cost) },
            { header: "الآجال", accessor: (row) => (row.is_delayed ? "متأخرة" : "ضمن الآجال") },
          ]}
        />
      ) : null}

      {activeTab === 3 ? (
        <DataTable
          data={team}
          emptyMessage="ما كاين حتى عضو معين لهذا الورش."
          columns={[
            { header: "الاسم", accessor: "employee_name" },
            { header: "الدور", accessor: (row) => ASSIGNMENT_ROLE_LABELS[row.assignment_role] },
            { header: "الأجرة اليومية", accessor: (row) => formatMAD(row.daily_salary) },
            { header: "الساعات/اليوم", accessor: "work_hours_per_day" },
            { header: "الحضور اليوم", accessor: (row) => (row.presence_today ? ATTENDANCE_STATUS_LABELS[row.presence_today] : "غير مسجل") },
          ]}
        />
      ) : null}

      {activeTab === 4 ? (
        <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <HardHat size={18} className="text-primary-700" />
              <h3 className="text-lg font-semibold">Pointage اليوم</h3>
            </div>
            <div className="space-y-3">
              {todayAttendance.length ? (
                todayAttendance.map((row) => (
                  <div key={row.id} className="rounded-2xl bg-slate-50 p-4 text-sm">
                    <div className="flex justify-between">
                      <span>المستخدم #{row.employee_id}</span>
                      <strong>{ATTENDANCE_STATUS_LABELS[row.status]}</strong>
                    </div>
                    <p className="mt-2 text-slate-500">المهام: {row.tasks_completed ?? "—"}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">ما كاينش pointage اليوم.</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <ScrollText size={18} className="text-primary-700" />
              <h3 className="text-lg font-semibold">التقرير اليومي</h3>
            </div>
            {dailyReport ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>التاريخ</span><strong>{formatDate(dailyReport.report_date)}</strong></div>
                <div className="flex justify-between"><span>النقطة مكتملة</span><strong>{dailyReport.attendance_completed ? "نعم" : "لا"}</strong></div>
                <div className="flex justify-between"><span>التسليمات</span><strong>{dailyReport.deliveries_received}</strong></div>
                <div className="flex justify-between"><span>المصاريف</span><strong>{dailyReport.expenses_added}</strong></div>
                <div>
                  <p className="text-slate-500">الأشغال المنجزة</p>
                  <p className="mt-1 font-medium text-slate-900">{dailyReport.completed_tasks ?? "—"}</p>
                </div>
                <div>
                  <p className="text-slate-500">ملاحظة رئيس الورش</p>
                  <p className="mt-1 font-medium text-slate-900">{dailyReport.supervisor_note ?? "—"}</p>
                </div>
              </div>
            ) : (
              <EmptyState icon={ScrollText} title="ما كاين حتى تقرير يومي" description="أنشئ التقرير اليومي باش يتجمع النشاط اليومي في مكان واحد." />
            )}
          </Card>
        </div>
      ) : null}

      {activeTab === 5 ? (
        <DataTable
          data={expenses}
          emptyMessage="ما كاين حتى مصروف."
          columns={[
            { header: "المصروف", accessor: "title" },
            { header: "الفئة", accessor: (row) => EXPENSE_CATEGORY_LABELS[row.category] },
            { header: "المبلغ", accessor: (row) => formatMAD(row.amount) },
            { header: "التاريخ", accessor: (row) => formatDate(row.expense_date) },
            { header: "الاعتماد", accessor: (row) => (row.is_validated ? "مصادق عليه" : "في الانتظار") },
          ]}
        />
      ) : null}

      {activeTab === 6 ? (
        <DataTable
          data={deliveries}
          emptyMessage="ما كاين حتى تسليم مواد."
          columns={[
            { header: "التوريد", accessor: "title" },
            { header: "المادة", accessor: "material_name" },
            { header: "المورد", accessor: (row) => row.supplier?.name ?? "—" },
            { header: "الكمية", accessor: (row) => `${row.quantity} ${row.unit}` },
            { header: "المخزون", accessor: (row) => `${row.stock_quantity} ${row.unit}` },
            { header: "الحالة", accessor: (row) => DELIVERY_STATUS_LABELS[row.status] },
          ]}
        />
      ) : null}

      {activeTab === 7 ? (
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>الإجمالي الخام</span><strong>{formatMAD(salarySummary?.gross_total)}</strong></div>
              <div className="flex justify-between"><span>الساعات الإضافية</span><strong>{formatMAD(salarySummary?.overtime_total)}</strong></div>
              <div className="flex justify-between"><span>السلف</span><strong>{formatMAD(salarySummary?.advances_total)}</strong></div>
              <div className="flex justify-between"><span>الصافي</span><strong>{formatMAD(salarySummary?.net_total)}</strong></div>
              <div className="flex justify-between"><span>المؤدى</span><strong>{formatMAD(salarySummary?.paid_total)}</strong></div>
              <div className="flex justify-between"><span>الباقي</span><strong>{formatMAD(salarySummary?.remaining_total)}</strong></div>
            </div>
          </Card>
          <DataTable
            data={salarySummary?.salaries ?? []}
            emptyMessage="ما كاين حتى حساب رواتب."
            columns={[
              { header: "الموظف", accessor: "employee_name" },
              { header: "الأيام", accessor: "worked_days" },
              { header: "الصافي", accessor: (row) => formatMAD(row.net_salary) },
              { header: "المؤدى", accessor: (row) => formatMAD(row.paid_amount) },
              { header: "الباقي", accessor: (row) => formatMAD(row.remaining_amount) },
              { header: "الحالة", accessor: (row) => PAYMENT_STATUS_LABELS[row.payment_status] },
            ]}
          />
        </div>
      ) : null}

      {activeTab === 8 ? (
        <DataTable
          data={documents}
          emptyMessage="ما كاين حتى وثيقة."
          columns={[
            { header: "الملف", accessor: "file_name" },
            { header: "النوع", accessor: (row) => RELATED_TYPE_LABELS[row.related_type] },
            { header: "التاريخ", accessor: (row) => formatDate(row.created_at) },
            {
              header: "الرابط",
              accessor: (row) => (
                <a className="text-primary-700 underline" href={`${process.env.NEXT_PUBLIC_API_URL}${row.file_url}`}>
                  فتح
                </a>
              ),
            },
          ]}
        />
      ) : null}

      {activeTab === 9 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <ReceiptText size={18} className="text-primary-700" />
              <h3 className="text-lg font-semibold">تقرير مالي سريع</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>الميزانية</span><strong>{formatMAD(financial?.budget_prevu)}</strong></div>
              <div className="flex justify-between"><span>الكلفة الحقيقية</span><strong>{formatMAD(financial?.cout_reel)}</strong></div>
              <div className="flex justify-between"><span>المشتريات المعتمدة</span><strong>{formatMAD(financial?.achats_valides_total)}</strong></div>
              <div className="flex justify-between"><span>الرواتب</span><strong>{formatMAD(financial?.salaires_total)}</strong></div>
              <div className="flex justify-between"><span>الهامش الحقيقي</span><strong>{formatMAD(financial?.marge_reelle)}</strong></div>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <FileImage size={18} className="text-primary-700" />
              <h3 className="text-lg font-semibold">التقارير والوثائق</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>آخر تقرير يومي</span><strong>{formatDate(dailyReport?.report_date)}</strong></div>
              <div className="flex justify-between"><span>عدد الوثائق</span><strong>{documents.length}</strong></div>
              <div className="flex justify-between"><span>عدد التسليمات</span><strong>{deliveries.length}</strong></div>
              <div className="flex justify-between"><span>الملفات المالية الثقيلة</span><strong>{financial?.top_cost_items?.length ?? 0}</strong></div>
            </div>
          </Card>
        </div>
      ) : null}
    </AppShell>
  );
}
