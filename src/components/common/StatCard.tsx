import type { LucideIcon } from "lucide-react";

export function StatCard({ title, value, detail, icon: Icon, iconClassName = "bg-blue-50 text-blue-700" }: {
  title: string;
  value: number | string;
  detail: string;
  icon: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${iconClassName}`}><Icon aria-hidden="true" className="size-5" /></span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{detail}</p>
    </section>
  );
}
