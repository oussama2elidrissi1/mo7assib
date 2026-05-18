import Link from "next/link";
import Button from "./Button";

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: { href?: string; label: string; variant?: "primary" | "secondary" | "ghost" }[];
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary-600">{eyebrow}</p> : null}
        <h1 className="text-3xl font-bold text-slate-950">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {actions?.length ? (
        <div className="flex flex-wrap gap-3">
          {actions.map((action) =>
            action.href ? (
              <Link key={action.label} href={action.href}>
                <Button variant={action.variant ?? "primary"}>{action.label}</Button>
              </Link>
            ) : (
              <Button key={action.label} variant={action.variant ?? "primary"}>{action.label}</Button>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
