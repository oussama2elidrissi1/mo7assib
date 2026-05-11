import { LucideIcon } from "lucide-react";
import { Card } from "./Card";

export default function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  accent = "blue",
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "blue" | "yellow" | "green" | "red";
}) {
  const accents = {
    blue: "bg-primary-600/10 text-primary-700 ring-primary-100",
    yellow: "bg-accent-500/15 text-amber-700 ring-amber-100",
    green: "bg-emerald-500/10 text-emerald-700 ring-emerald-100",
    red: "bg-red-500/10 text-red-700 ring-red-100",
  };
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
          {hint ? <p className="mt-2 text-xs text-slate-400">{hint}</p> : null}
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${accents[accent]}`}>
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}
