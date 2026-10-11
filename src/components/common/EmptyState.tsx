import { Inbox } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", description = "Try changing your search or create a new record." }: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center">
      <span className="grid size-11 place-items-center rounded-lg bg-slate-100 text-slate-500"><Inbox className="size-5" /></span>
      <h2 className="mt-3 text-sm font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}
