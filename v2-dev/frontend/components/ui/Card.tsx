import clsx from "clsx";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_18px_40px_-24px_rgba(6,26,51,0.28)] backdrop-blur", className)}>
      {children}
    </div>
  );
}
