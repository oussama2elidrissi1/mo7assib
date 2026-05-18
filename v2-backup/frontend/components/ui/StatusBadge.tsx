import { Badge } from "./Badge";
import { statusVariant } from "@/lib/types";

export default function StatusBadge({ status, label }: { status: string; label: string }) {
  return <Badge label={label} variant={statusVariant(status)} />;
}
