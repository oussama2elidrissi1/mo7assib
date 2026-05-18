import clsx from "clsx";
export { statusVariant } from "@/lib/types";

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
  return <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", variants[variant])}>{label}</span>;
}
