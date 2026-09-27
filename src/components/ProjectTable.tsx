import type { Department } from '@/types/department';
import type { Project } from '@/types/project';

type ProjectTableProps = {
  projects: Project[];
  departments: Department[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
  isLoading?: boolean;
  statusLabelMap?: Record<number, string>;
};

export default function ProjectTable({
  projects,
  departments,
  onEdit,
  onDelete,
  isLoading = false,
  statusLabelMap = {},
}: ProjectTableProps) {
  const departmentMap = new Map(
    departments.map((department) => [department.departmentId, department.departmentName]),
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-violet-600" />
          Loading projects...
        </div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        No projects found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-700">
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Project Name</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Department</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Start Date</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">End Date</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Status</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Active</th>
            <th className="border-b border-slate-200 px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.projectId} className="align-top hover:bg-slate-50">
              <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-900">
                {project.projectName}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-600">
                {departmentMap.get(project.departmentId) ?? 'Unknown'}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-600">
                {project.startDate}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-600">
                {project.endDate || '—'}
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <span className="inline-flex rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
                  {statusLabelMap[project.status] ?? `Status ${project.status}`}
                </span>
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    project.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {project.isActive ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(project.projectId)}
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
