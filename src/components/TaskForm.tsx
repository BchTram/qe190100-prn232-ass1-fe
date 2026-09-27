'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

export type TaskFormValues = {
  title: string;
  description: string;
  status: number;
  priority: number;
  dueDate: string;
  projectId: number;
  isActive?: boolean;
};

type ProjectOption = {
  projectId: number;
  projectName: string;
};

type TaskFormProps = {
  mode: 'create' | 'edit';
  projects: ProjectOption[];
  initialValues?: Partial<TaskFormValues>;
  isLoading?: boolean;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel?: () => void;
};

const defaultValues: TaskFormValues = {
  title: '',
  description: '',
  status: 0,
  priority: 1,
  dueDate: '',
  projectId: 0,
  isActive: true,
};

export default function TaskForm({
  mode,
  projects,
  initialValues,
  isLoading = false,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>({
    ...defaultValues,
    ...(initialValues ?? {}),
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValues({
      ...defaultValues,
      ...(initialValues ?? {}),
    });
    setError(null);
  }, [initialValues]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target as HTMLInputElement;

    if (type === 'checkbox') {
      setValues((prev) => ({
        ...prev,
        [name]: (event.target as HTMLInputElement).checked,
      }));
      return;
    }

    if (name === 'status' || name === 'priority' || name === 'projectId') {
      setValues((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
      return;
    }

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = values.title.trim();

    if (!title) {
      setError('Task Name is required.');
      return;
    }

    if (!values.projectId || Number(values.projectId) <= 0) {
      setError('Please select a valid project.');
      return;
    }

    setError(null);
    await onSubmit({
      ...values,
      title,
      description: values.description.trim(),
      status: Number(values.status),
      priority: Number(values.priority),
      dueDate: values.dueDate || '',
      projectId: Number(values.projectId),
      isActive: values.isActive ?? true,
    });
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {mode === 'create' ? 'Create Task' : 'Edit Task'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">
            Task Name
          </label>
          <input
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label htmlFor="projectId" className="mb-1.5 block text-sm font-medium text-slate-700">
            Project
          </label>
          <select
            id="projectId"
            name="projectId"
            value={values.projectId}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value={0}>Select project</option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.projectId}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={values.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value={0}>Open</option>
              <option value={1}>In Progress</option>
              <option value={2}>Completed</option>
              <option value={3}>Blocked</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-slate-700">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={values.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value={0}>Low</option>
              <option value={1}>Medium</option>
              <option value={2}>High</option>
              <option value={3}>Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="mb-1.5 block text-sm font-medium text-slate-700">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={values.dueDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Enter task description"
          />
        </div>

        {mode === 'edit' && (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              checked={Boolean(values.isActive)}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Active
          </label>
        )}

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isLoading
              ? (mode === 'create' ? 'Creating...' : 'Saving...')
              : (mode === 'create' ? 'Create Task' : 'Save Changes')}
          </button>

          {mode === 'edit' && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
