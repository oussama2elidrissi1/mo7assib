"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  ClipboardList,
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

import { logout } from "@/lib/auth";

const groups = [
  {
    title: "لوحة القيادة",
    items: [{ href: "/dashboard", label: "لوحة القيادة", icon: LayoutDashboard }],
  },
  {
    title: "المشاريع",
    items: [
      { href: "/projects", label: "كل المشاريع", icon: FolderKanban },
      { href: "/projects/new", label: "إنشاء مشروع", icon: Building2 },
      { href: "/projects?scope=active", label: "المشاريع النشطة", icon: BriefcaseBusiness },
      { href: "/projects?scope=delayed", label: "المشاريع المتأخرة", icon: ShieldCheck },
      { href: "/projects?scope=closed", label: "المشاريع المغلقة", icon: FolderKanban },
    ],
  },
  {
    title: "دورة الورش",
    items: [
      { href: "/projects", label: "الأرض", icon: Building2 },
      { href: "/projects", label: "البنايات والبلوكات", icon: Wrench },
      { href: "/tasks", label: "التخطيط والمراحل", icon: CalendarCheck2 },
      { href: "/tasks", label: "المهام", icon: ClipboardList },
      { href: "/attendance", label: "التقدم اليومي", icon: CalendarCheck2 },
    ],
  },
  {
    title: "الفريق والنقطة",
    items: [
      { href: "/employees", label: "العمال والموظفون", icon: Users },
      { href: "/employees", label: "التعيينات", icon: Users },
      { href: "/attendance", label: "النقطة اليومية", icon: CalendarCheck2 },
      { href: "/attendance", label: "الغيابات", icon: CalendarCheck2 },
      { href: "/attendance", label: "الساعات الإضافية", icon: CalendarCheck2 },
    ],
  },
  {
    title: "مالية الورش",
    items: [
      { href: "/projects", label: "الميزانية الأولية", icon: Wallet },
      { href: "/expenses", label: "المصاريف", icon: Receipt },
      { href: "/resources", label: "المشتريات والموارد", icon: Wrench },
      { href: "/salaries", label: "الرواتب", icon: Wallet },
      { href: "/advances", label: "السلف", icon: CreditCard },
      { href: "/salaries", label: "الدفعات", icon: Wallet },
      { href: "/dashboard", label: "الهامش والربحية", icon: BarChart3 },
    ],
  },
  {
    title: "الوثائق والتقارير",
    items: [
      { href: "/documents", label: "وثائق المشروع", icon: FileText },
      { href: "/documents", label: "صور الورش", icon: FileText },
      { href: "/documents", label: "الفواتير", icon: FileText },
      { href: "/documents", label: "بونات التسليم", icon: FileText },
      { href: "/reports", label: "التقارير", icon: BarChart3 },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { href: "/settings", label: "المستخدمون والأدوار", icon: Settings },
      { href: "/settings", label: "إعدادات الشركة", icon: Settings },
    ],
  },
];

function isActive(pathname: string, href: string) {
  const basePath = href.split("?")[0];
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/projects/new") return pathname === "/projects/new";
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-[22rem] shrink-0 border-l border-primary-800/80 bg-primary-900 text-white xl:flex xl:flex-col">
      <div className="border-b border-white/10 px-6 py-8">
        <p className="text-xs font-semibold tracking-[0.38em] text-primary-200">MO7ASSIB</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight">مركز قيادة الورش العقاري</h1>
        <p className="mt-3 text-sm leading-7 text-primary-200">
          منصة مهنية للمطورين العقاريين الصغار والمتوسطين، كتجمع التتبع اليومي والمالية والوثائق داخل نفس دورة حياة المشروع.
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
        {groups.map((group) => (
          <section key={group.title}>
            <p className="mb-3 px-3 text-xs font-semibold tracking-[0.24em] text-primary-300">{group.title}</p>
            <div className="space-y-1.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={`${group.title}-${label}`}
                    href={href}
                    className={clsx(
                      "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                      active
                        ? "bg-white text-primary-900 shadow-soft"
                        : "text-primary-100 hover:bg-white/8",
                    )}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-primary-100 transition hover:bg-white/8"
        >
          <LogOut size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
