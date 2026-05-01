import clsx from "clsx";

type Variant = "green" | "blue" | "yellow" | "red" | "gray" | "orange";

const variants: Record<Variant, string> = {
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-gray-100 text-gray-700",
  orange: "bg-orange-100 text-orange-800",
};

export function Badge({ label, variant = "gray" }: { label: string; variant?: Variant }) {
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", variants[variant])}>
      {label}
    </span>
  );
}

export function statusVariant(status: string): Variant {
  const map: Record<string, Variant> = {
    active: "green", planned: "blue", paused: "yellow", finished: "gray", cancelled: "red",
    todo: "gray", in_progress: "blue", done: "green", blocked: "red",
    present: "green", absent: "red", half_day: "yellow",
  };
  return map[status] ?? "gray";
}
