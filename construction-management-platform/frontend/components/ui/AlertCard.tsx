import { AlertTriangle, BellRing, CircleAlert } from "lucide-react";
import { Card } from "./Card";
import { ProjectAlert } from "@/lib/types";

export default function AlertCard({ alert }: { alert: ProjectAlert }) {
  const icon = alert.level === "high" ? AlertTriangle : alert.level === "medium" ? CircleAlert : BellRing;
  const tones = {
    high: "border-red-200 bg-red-50/80 text-red-700",
    medium: "border-amber-200 bg-amber-50/80 text-amber-700",
    low: "border-sky-200 bg-sky-50/80 text-sky-700",
  };
  const Icon = icon;
  return (
    <Card className={`border ${tones[alert.level]}`}>
      <div className="flex items-start gap-3">
        <Icon size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">{alert.title}</p>
          <p className="mt-1 text-sm leading-6">{alert.description}</p>
        </div>
      </div>
    </Card>
  );
}
