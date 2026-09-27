'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

export type ProjectFormValues = {
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: number;
  departmentId: number;
  isActive?: boolean;
};

type DepartmentOption = {
  departmentId: number;
  departmentName: string;
};

type ProjectFormProps = {
  mode: 'create' | 'edit';
  departments: DepartmentOption[];
  initialValues?: Partial<ProjectFormValues>;
  isLoading?: boolean;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel?: () => void;
};

const defaultValues: ProjectFormValues = {
  projectName: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 1,
  departmentId: 0,
  isActive: true,
};

export default function ProjectForm({
  mode,
  departments,
  initialValues,
  isLoading = false,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>({
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

    if (name === 'status' || name === 'departmentId') {
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

    const projectName = values.projectName.trim();
    const startDate = values.startDate;

    if (!projectName) {
      setError('Project Name is required.');
      return;
    }

    if (!startDate) {
      setError('Start Date is required.');
      return;
    }

    if (!values.departmentId || Number(values.departmentId) <= 0) {
      setError('Please select a valid department.');
      return;
    }

    if (values.endDate && values.endDate < startDate) {
      setError('End Date must be greater than or equal to Start Date.');
      return;
    }

    setError(null);
    await onSubmit({
      ...values,
      projectName,
      description: values.description.trim(),
      startDate,
      endDate: values.endDate || '',
      status: Number(values.status),
      departmentId: Number(values.departmentId),
      isActive: values.isActive ?? true,
    });
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {mode === 'create' ? 'Create Project' : 'Edit Project'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="mb-1.5 block text-sm font-medium text-slate-700">
            Project Name
          </label>
          <input
            id="projectName"
            name="projectName"
            value={values.projectName}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label htmlFor="departmentId" className="mb-1.5 block text-sm font-medium text-slate-700">
            Department
          </label>
          <select
            id="departmentId"
            name="departmentId"
            value={values.departmentId}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value={0}>Select department</option>
            {departments.map((department) => (
              <option key={department.departmentId} value={department.departmentId}>
                {department.departmentName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="mb-1.5 block text-sm font-medium text-slate-700">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={values.startDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="mb-1.5 block text-sm font-medium text-slate-700">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={values.endDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>
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
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value={0}>Not Started</option>
              <option value={1}>In Progress</option>
              <option value={2}>Completed</option>
              <option value={3}>On Hold</option>
            </select>
          </div>

          {mode === 'edit' && (
            <label className="flex items-center gap-2 pt-7 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={Boolean(values.isActive)}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              />
              Active
            </label>
          )}
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
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            placeholder="Enter project description"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
          >
            {isLoading
              ? (mode === 'create' ? 'Creating...' : 'Saving...')
              : (mode === 'create' ? 'Create Project' : 'Save Changes')}
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
