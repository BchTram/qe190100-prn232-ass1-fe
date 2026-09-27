import type { Project } from '@/types/project';
import type { Task } from '@/types/task';

type TaskTableProps = {
  tasks: Task[];
  projects: Project[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  isLoading?: boolean;
  statusLabelMap?: Record<number, string>;
  priorityLabelMap?: Record<number, string>;
};

export default function TaskTable({
  tasks,
  projects,
  onEdit,
  onDelete,
  isLoading = false,
  statusLabelMap = {},
  priorityLabelMap = {},
}: TaskTableProps) {
  const projectMap = new Map(
    projects.map((project) => [project.projectId, project.projectName]),
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
          Loading tasks...
        </div>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        No tasks found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-700">
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Task Name</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Project</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Status</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Priority</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Due Date</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Active</th>
            <th className="border-b border-slate-200 px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.taskId} className="align-top hover:bg-slate-50">
              <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-900">
                {task.title}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-600">
                {projectMap.get(task.projectId) ?? 'Unknown'}
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  {statusLabelMap[task.status] ?? `Status ${task.status}`}
                </span>
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                  {priorityLabelMap[task.priority] ?? `Priority ${task.priority}`}
                </span>
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-600">
                {task.dueDate || '—'}
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    task.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {task.isActive ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(task.taskId)}
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
