import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center">
      <span className="grid size-11 place-items-center rounded-lg bg-rose-50 text-rose-700"><TriangleAlert className="size-5" /></span>
      <h2 className="mt-3 text-sm font-semibold text-slate-900">Could not load this data</h2>
      <p role="alert" className="mt-1 max-w-lg text-sm text-slate-600">{message}</p>
      {onRetry && <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
