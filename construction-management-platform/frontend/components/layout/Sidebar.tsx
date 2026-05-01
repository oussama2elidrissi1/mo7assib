"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, Users, Clock, CheckSquare,
  ShoppingCart, Receipt, FileText, LogOut,
} from "lucide-react";
import { logout } from "@/lib/auth";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/projects", label: "Chantiers", icon: FolderOpen },
  { href: "/employees", label: "Employés", icon: Users },
  { href: "/attendance", label: "Pointage", icon: Clock },
  { href: "/tasks", label: "Tâches", icon: CheckSquare },
  { href: "/resources", label: "Achats & Ressources", icon: ShoppingCart },
  { href: "/expenses", label: "Charges", icon: Receipt },
  { href: "/documents", label: "Documents", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 min-h-screen bg-primary-900 text-white flex flex-col">
      <div className="p-6 border-b border-primary-700">
        <h1 className="text-xl font-bold">Gestion Chantier</h1>
        <p className="text-xs text-primary-300 mt-1">Plateforme immobilière</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-primary-600 text-white"
                : "text-primary-200 hover:bg-primary-700 hover:text-white"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-primary-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-primary-200 hover:bg-primary-700 hover:text-white w-full transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
