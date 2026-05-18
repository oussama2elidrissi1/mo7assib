export default function ProgressBar({ value, tone = "blue" }: { value: number; tone?: "blue" | "green" | "yellow" | "red" }) {
  const pct = Math.min(100, Math.max(0, value));
  const tones = {
    blue: "from-primary-500 to-primary-700",
    green: "from-emerald-500 to-green-600",
    yellow: "from-amber-400 to-accent-500",
    red: "from-red-400 to-red-600",
  };
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-200">
      <div className={`h-2.5 rounded-full bg-gradient-to-l transition-all ${tones[tone]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
