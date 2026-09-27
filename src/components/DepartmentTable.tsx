import type { Department } from '@/types/department';

type DepartmentTableProps = {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (departmentId: number) => void;
  isLoading?: boolean;
};

export default function DepartmentTable({
  departments,
  onEdit,
  onDelete,
  isLoading = false,
}: DepartmentTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
          Loading departments...
        </div>
      </div>
    );
  }

  if (!departments.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        No departments found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-700">
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Department Name</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Description</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Active</th>
            <th className="border-b border-slate-200 px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department.departmentId} className="align-top hover:bg-slate-50">
              <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-900">
                {department.departmentName}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-600">
                {department.departmentDescription || '—'}
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    department.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {department.isActive ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(department)}
                    className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(department.departmentId)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
