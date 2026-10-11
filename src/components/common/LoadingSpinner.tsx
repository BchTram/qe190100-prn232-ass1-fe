import { LoaderCircle } from "lucide-react";

export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-slate-500" role="status">
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-blue-600" />
      <span>{label}</span>
    </div>
  );
}
