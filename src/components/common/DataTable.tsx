import type { ReactNode } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export type DataColumn<Row> = {
  key: string;
  header: string;
  render: (row: Row) => ReactNode;
};

export function DataTable<Row>({ rows, columns, getRowKey, loading = false, emptyTitle, emptyDescription }: {
  rows: Row[];
  columns: DataColumn<Row>[];
  getRowKey: (row: Row) => string | number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (loading) return <LoadingSpinner />;
  if (!rows.length) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead><tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
          {columns.map((column) => <th key={column.key} scope="col" className="px-4 py-3">{column.header}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => <tr key={getRowKey(row)} className="align-middle hover:bg-slate-50/80">
            {columns.map((column) => <td key={column.key} className="px-4 py-3.5 text-slate-700">{column.render(row)}</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}
