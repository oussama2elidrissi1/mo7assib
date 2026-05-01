// ---- Enums ----
export type UserRole = "admin" | "project_manager" | "site_supervisor" | "accountant" | "viewer";
export type ClientType = "private" | "public";
export type ProjectType = "labor_only" | "labor_with_materials";
export type ProjectStatus = "planned" | "active" | "paused" | "finished" | "cancelled";
export type EmployeeRole = "engineer" | "site_supervisor" | "maalem" | "worker" | "accountant" | "other";
export type AttendanceStatus = "present" | "absent" | "half_day";
export type TaskCategory = "foundation" | "structure" | "masonry" | "plumbing" | "electricity" | "finishing" | "other";
export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high";
export type ResourceType = "purchase" | "delivery" | "material" | "equipment";
export type ExpenseCategory = "labor" | "materials" | "transport" | "equipment" | "admin" | "other";
export type PaymentMethod = "cash" | "bank_transfer" | "check" | "card" | "other";
export type RelatedType = "project" | "land" | "resource" | "expense";

// ---- Models ----
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  client_type: ClientType;
  location: string;
  address?: string;
  project_type: ProjectType;
  status: ProjectStatus;
  start_date?: string;
  estimated_end_date?: string;
  agreed_price?: number;
  estimated_duration_days?: number;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectLand {
  id: number;
  project_id: number;
  surface_area_m2?: number;
  land_address?: string;
  floors_count?: number;
  has_basement?: boolean;
  basement_count?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Building {
  id: number;
  project_id: number;
  name: string;
  surface_area_m2?: number;
  number_of_floors?: number;
  number_of_apartments?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  project_id: number;
  name: string;
  role: EmployeeRole;
  phone?: string;
  daily_salary?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: number;
  employee_id: number;
  project_id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  worked_hours?: number;
  status: AttendanceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  assigned_to?: number;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: number;
  project_id: number;
  type: ResourceType;
  title: string;
  description?: string;
  amount?: number;
  supplier_name?: string;
  supplier_phone?: string;
  purchase_date?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  project_id: number;
  category: ExpenseCategory;
  title: string;
  amount: number;
  expense_date: string;
  payment_method: PaymentMethod;
  supplier_name?: string;
  receipt_file_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  project_id: number;
  related_type: RelatedType;
  related_id?: number;
  file_name: string;
  file_url: string;
  mime_type?: string;
  file_size?: number;
  uploaded_by?: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectProgress {
  project_id: number;
  total_tasks: number;
  completed_tasks: number;
  progress_percentage: number;
}

export interface ProjectFinancialSummary {
  project_id: number;
  agreed_price: number;
  manual_expenses: number;
  labor_cost: number;
  total_expenses: number;
  estimated_margin: number;
}

export interface DashboardData {
  total_projects: number;
  active_projects: number;
  finished_projects: number;
  total_expenses: number;
  today_attendance_count: number;
}

// ---- Label helpers ----
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planifié",
  active: "Actif",
  paused: "En pause",
  finished: "Terminé",
  cancelled: "Annulé",
};

export const EMPLOYEE_ROLE_LABELS: Record<EmployeeRole, string> = {
  engineer: "Ingénieur",
  site_supervisor: "Chef de chantier",
  maalem: "Maâlem",
  worker: "Ouvrier",
  accountant: "Comptable",
  other: "Autre",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminé",
  blocked: "Bloqué",
};

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  foundation: "Fondations",
  structure: "Structure",
  masonry: "Maçonnerie",
  plumbing: "Plomberie",
  electricity: "Électricité",
  finishing: "Finitions",
  other: "Autre",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  labor: "Main d'œuvre",
  materials: "Matériaux",
  transport: "Transport",
  equipment: "Équipement",
  admin: "Administratif",
  other: "Autre",
};
