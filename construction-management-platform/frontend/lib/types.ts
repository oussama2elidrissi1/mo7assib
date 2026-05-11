export type UserRole = "admin" | "project_manager" | "site_supervisor" | "accountant" | "viewer";
export type ClientType = "private" | "public";
export type ProjectType = "labor_only" | "labor_with_materials";
export type ProjectStatus = "draft" | "planned" | "active" | "paused" | "finished" | "cancelled" | "archived";
export type EmployeeRole = "engineer" | "site_supervisor" | "maalem" | "worker" | "accountant" | "other";
export type AttendanceStatus = "present" | "absent" | "half_day";
export type ExpenseCategory = "labor" | "materials" | "transport" | "equipment" | "admin" | "other";
export type PaymentMethod = "cash" | "bank_transfer" | "check" | "card" | "other";
export type AdvanceStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "unpaid" | "partial" | "paid";
export type TaskCategory = "foundation" | "structure" | "masonry" | "plumbing" | "electricity" | "finishing" | "other";
export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high";
export type ResourceType = "purchase" | "delivery" | "material" | "equipment";
export type AssignmentRole = "project_manager" | "site_supervisor" | "maalem" | "worker" | "accountant" | "other";
export type ProjectPhaseKey =
  | "earthwork"
  | "foundation"
  | "structure"
  | "electricity"
  | "plumbing"
  | "plaster"
  | "tiling"
  | "painting"
  | "finishing"
  | "delivery";
export type ProjectPhaseStatus = "pending" | "in_progress" | "completed" | "delayed";
export type DeliveryStatus = "ordered" | "delivered" | "consumed";
export type RelatedType =
  | "project"
  | "land"
  | "resource"
  | "expense"
  | "contract"
  | "plan"
  | "invoice"
  | "delivery_note"
  | "site_photo"
  | "authorization";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export interface Project {
  id: number;
  name: string;
  client_type: ClientType;
  location: string;
  city?: string | null;
  address?: string | null;
  project_type: ProjectType;
  status: ProjectStatus;
  start_date?: string | null;
  estimated_end_date?: string | null;
  agreed_price?: number | null;
  estimated_budget?: number | null;
  current_progress?: number | null;
  estimated_duration_days?: number | null;
  description?: string | null;
}

export interface ProjectLand {
  id: number;
  project_id: number;
  surface_area_m2?: number | null;
  land_address?: string | null;
  title_reference?: string | null;
  floors_count?: number | null;
  has_basement?: boolean | null;
  basement_count?: number | null;
  contract_scope?: string | null;
  terrain_documents?: string | null;
  notes?: string | null;
}

export interface Building {
  id: number;
  project_id: number;
  name: string;
  surface_area_m2?: number | null;
  number_of_floors?: number | null;
  number_of_apartments?: number | null;
  notes?: string | null;
}

export interface Employee {
  id: number;
  project_id: number;
  name: string;
  role: EmployeeRole;
  phone?: string | null;
  cin?: string | null;
  job_title?: string | null;
  daily_salary?: number | null;
  hourly_wage?: number | null;
  work_hours_per_day?: number | null;
  is_active: boolean;
}

export interface Attendance {
  id: number;
  employee_id: number;
  project_id: number;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  worked_hours?: number | null;
  overtime_hours?: number | null;
  status: AttendanceStatus;
  notes?: string | null;
  supervisor_note?: string | null;
  tasks_completed?: string | null;
  photo_count: number;
}

export interface Task {
  id: number;
  project_id: number;
  assigned_to?: number | null;
  title: string;
  description?: string | null;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  start_date?: string | null;
  end_date?: string | null;
}

export interface Resource {
  id: number;
  project_id: number;
  type: ResourceType;
  title: string;
  description?: string | null;
  amount?: number | null;
  supplier_name?: string | null;
  supplier_phone?: string | null;
  purchase_date?: string | null;
  file_url?: string | null;
}

export interface Expense {
  id: number;
  project_id: number;
  category: ExpenseCategory;
  title: string;
  amount: number;
  expense_date: string;
  payment_method: PaymentMethod;
  supplier_name?: string | null;
  receipt_file_url?: string | null;
  is_validated: boolean;
  validated_by?: number | null;
  notes?: string | null;
}

export interface Advance {
  id: number;
  employee_id: number;
  project_id: number;
  requested_amount: number;
  approved_amount?: number | null;
  reason?: string | null;
  status: AdvanceStatus;
  advance_date: string;
  month?: string | null;
}

export interface SalaryPayment {
  id: number;
  salary_calculation_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes?: string | null;
}

export interface SalaryCalculation {
  id: number;
  employee_id: number;
  project_id: number;
  month: string;
  worked_days: number;
  base_salary: number;
  overtime_hours: number;
  overtime_amount: number;
  advances_total: number;
  deductions: number;
  net_salary: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: PaymentStatus;
  notes?: string | null;
  payments?: SalaryPayment[];
}

export interface ProjectBudget {
  id: number;
  project_id: number;
  labor_budget: number;
  materials_budget: number;
  equipment_budget: number;
  other_budget: number;
  estimated_margin: number;
  budget_total: number;
}

export interface ProjectPhase {
  id: number;
  project_id: number;
  name: string;
  phase_key: ProjectPhaseKey;
  sequence: number;
  status: ProjectPhaseStatus;
  start_date?: string | null;
  end_date?: string | null;
  progress_percentage: number;
  budget_planned: number;
  actual_cost: number;
  notes?: string | null;
  is_delayed: boolean;
}

export interface ProjectAssignment {
  id: number;
  project_id: number;
  employee_id: number;
  employee_name: string;
  employee_phone?: string | null;
  assignment_role: AssignmentRole;
  daily_salary: number;
  work_hours_per_day: number;
  is_primary: boolean;
  presence_today?: AttendanceStatus | null;
}

export interface DailySiteReport {
  id: number;
  project_id: number;
  report_date: string;
  attendance_completed: boolean;
  completed_tasks?: string | null;
  supervisor_note?: string | null;
  photo_urls?: string | null;
  deliveries_received: number;
  expenses_added: number;
}

export interface MaterialSupplier {
  id: number;
  name: string;
  phone?: string | null;
  city?: string | null;
  specialty?: string | null;
}

export interface MaterialDelivery {
  id: number;
  project_id: number;
  supplier_id?: number | null;
  title: string;
  material_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  delivery_date: string;
  status: DeliveryStatus;
  stock_quantity: number;
  notes?: string | null;
  supplier?: MaterialSupplier | null;
}

export interface ProjectDocument {
  id: number;
  file_name: string;
  file_url: string;
  related_type: RelatedType;
  created_at: string;
}

export interface ProjectAlert {
  level: "high" | "medium" | "low";
  code: string;
  title: string;
  description: string;
}

export interface ProjectOverview {
  id: number;
  name: string;
  city?: string | null;
  location: string;
  address?: string | null;
  status: ProjectStatus;
  description?: string | null;
  start_date?: string | null;
  estimated_end_date?: string | null;
  agreed_price: number;
  budget_prevu: number;
  cout_reel: number;
  marge_estimee: number;
  marge_reelle: number;
  taux_avancement: number;
  taux_depassement_budget: number;
  prochaine_phase?: string | null;
  chef_chantier?: string | null;
  project_manager?: string | null;
  team_count: number;
  present_today_count: number;
  absent_today_count: number;
  documents_count: number;
  pending_expenses_count: number;
  validated_deliveries_count: number;
  delayed_phases_count: number;
  budget?: ProjectBudget | null;
  alerts: ProjectAlert[];
}

export interface ProjectFinancialSummary {
  project_id: number;
  budget_prevu: number;
  cout_reel: number;
  depenses_total: number;
  achats_valides_total: number;
  salaires_total: number;
  marge_estimee: number;
  marge_reelle: number;
  taux_depassement_budget: number;
  expenses_breakdown: Record<string, number>;
  top_cost_items: { label: string; amount: number }[];
  agreed_price?: number;
  manual_expenses?: number;
  labor_cost?: number;
  total_expenses?: number;
  estimated_margin?: number;
}

export interface ProjectSalaryRow {
  salary_id: number;
  employee_id: number;
  employee_name: string;
  month: string;
  worked_days: number;
  gross_salary: number;
  overtime_amount: number;
  advances_total: number;
  deductions: number;
  net_salary: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: PaymentStatus;
  payments: SalaryPayment[];
}

export interface ProjectSalarySummary {
  project_id: number;
  month: string;
  gross_total: number;
  overtime_total: number;
  advances_total: number;
  net_total: number;
  paid_total: number;
  remaining_total: number;
  unpaid_count: number;
  salaries: ProjectSalaryRow[];
}

export interface DashboardProjectCard {
  id: number;
  name: string;
  city?: string | null;
  status: ProjectStatus;
  progress: number;
  budget_prevu: number;
  cout_reel: number;
  marge_estimee: number;
  prochaine_phase?: string | null;
  chef_chantier?: string | null;
}

export interface DashboardActivityItem {
  label: string;
  value: string;
}

export interface DashboardFinanceQuick {
  budget_vs_actual: { label: string; budget: number; actual: number }[];
  expenses_distribution: { label: string; amount: number }[];
  top_cost_projects: DashboardProjectCard[];
}

export interface DashboardSummary {
  greeting_name: string;
  active_projects: number;
  delayed_projects: number;
  budget_total_engaged: number;
  cout_reel_total: number;
  marge_estimee_total: number;
  depenses_mois: number;
  salaires_a_payer: number;
  employes_presents_aujourdhui: number;
  alerts: ProjectAlert[];
  active_site_cards: DashboardProjectCard[];
  today_activity: DashboardActivityItem[];
  finance_quick: DashboardFinanceQuick;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: "مسودة",
  planned: "مخطط",
  active: "نشط",
  paused: "متوقف",
  finished: "منتهي",
  cancelled: "ملغى",
  archived: "مؤرشف",
};

export const EMPLOYEE_ROLE_LABELS: Record<EmployeeRole, string> = {
  engineer: "مهندس",
  site_supervisor: "رئيس الورش",
  maalem: "معلّم",
  worker: "عامل",
  accountant: "محاسب",
  other: "مستخدم",
};

export const ASSIGNMENT_ROLE_LABELS: Record<AssignmentRole, string> = {
  project_manager: "مدير المشروع",
  site_supervisor: "رئيس الورش",
  maalem: "معلّم",
  worker: "عامل",
  accountant: "محاسب",
  other: "مستخدم",
};

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "حاضر",
  absent: "غائب",
  half_day: "نصف يوم",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  labor: "اليد العاملة",
  materials: "المواد",
  transport: "النقل",
  equipment: "المعدات",
  admin: "إداري",
  other: "أخرى",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "للإنجاز",
  in_progress: "قيد الإنجاز",
  done: "منجز",
  blocked: "متوقف",
};

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  foundation: "الأساسات",
  structure: "الهيكل",
  masonry: "البناء",
  plumbing: "السباكة",
  electricity: "الكهرباء",
  finishing: "التشطيب",
  other: "أخرى",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "غير مؤدى",
  partial: "مؤدى جزئيا",
  paid: "مؤدى",
};

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  ordered: "مطلوب",
  delivered: "تم التسليم",
  consumed: "مستهلك",
};

export const PHASE_STATUS_LABELS: Record<ProjectPhaseStatus, string> = {
  pending: "لم تبدأ",
  in_progress: "قيد الإنجاز",
  completed: "منتهية",
  delayed: "متأخرة",
};

export const PHASE_KEY_LABELS: Record<ProjectPhaseKey, string> = {
  earthwork: "التهيئة والحفر",
  foundation: "الأساسات",
  structure: "الهيكل",
  electricity: "الكهرباء",
  plumbing: "السباكة",
  plaster: "اللياسة",
  tiling: "التبليط",
  painting: "الصباغة",
  finishing: "التشطيب",
  delivery: "التسليم",
};

export const RELATED_TYPE_LABELS: Record<RelatedType, string> = {
  project: "وثيقة مشروع",
  land: "وثيقة أرض",
  resource: "مورد",
  expense: "مصروف",
  contract: "عقد",
  plan: "تصميم",
  invoice: "فاتورة",
  delivery_note: "بون تسليم",
  site_photo: "صورة ورش",
  authorization: "ترخيص",
};

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  private: "خاص",
  public: "عمومي",
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  labor_only: "يد عاملة فقط",
  labor_with_materials: "مع التوريد",
};

export const CONTRACT_SCOPE_LABELS: Record<string, string> = {
  labor_only: "يد عاملة فقط",
  labor_with_materials: "مع التوريد",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "نقدا",
  bank_transfer: "تحويل بنكي",
  check: "شيك",
  card: "بطاقة",
  other: "أخرى",
};

export const formatMAD = (value?: number | null) =>
  value == null ? "—" : new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(value);

export const formatPercent = (value?: number | null) => `${Math.round(value ?? 0)}%`;

export const formatDate = (value?: string | null) =>
  value ? new Intl.DateTimeFormat("ar-MA", { dateStyle: "medium" }).format(new Date(value)) : "—";

export const statusVariant = (status: string) => {
  const map: Record<string, "green" | "blue" | "yellow" | "red" | "gray" | "orange"> = {
    active: "green",
    planned: "blue",
    draft: "gray",
    paused: "yellow",
    finished: "gray",
    cancelled: "red",
    archived: "gray",
    pending: "gray",
    in_progress: "blue",
    completed: "green",
    delayed: "red",
    delivered: "green",
    consumed: "orange",
    ordered: "blue",
    present: "green",
    absent: "red",
    half_day: "yellow",
    unpaid: "red",
    partial: "yellow",
    paid: "green",
  };
  return map[status] ?? "gray";
};
