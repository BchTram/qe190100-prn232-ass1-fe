'use client';

import { useEffect, useState } from 'react';

export type DepartmentFormValues = {
  departmentName: string;
  departmentDescription: string;
  isActive?: boolean;
};

type DepartmentFormProps = {
  mode: 'create' | 'edit';
  initialValues?: DepartmentFormValues;
  isLoading?: boolean;
  onSubmit: (values: DepartmentFormValues) => Promise<void>;
  onCancel?: () => void;
};

const defaultValues: DepartmentFormValues = {
  departmentName: '',
  departmentDescription: '',
  isActive: true,
};

export default function DepartmentForm({
  mode,
  initialValues,
  isLoading = false,
  onSubmit,
  onCancel,
}: DepartmentFormProps) {
  const [values, setValues] = useState<DepartmentFormValues>({
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target as HTMLInputElement;

    if (type === 'checkbox') {
      setValues((prev) => ({
        ...prev,
        [name]: (event.target as HTMLInputElement).checked,
      }));
      return;
    }

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = values.departmentName.trim();
    if (!name) {
      setError('Department Name is required.');
      return;
    }

    setError(null);
    await onSubmit({
      ...values,
      departmentName: name,
      departmentDescription: values.departmentDescription.trim(),
      isActive: values.isActive ?? true,
    });
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {mode === 'create' ? 'Create Department' : 'Edit Department'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="departmentName" className="mb-1.5 block text-sm font-medium text-slate-700">
            Department Name
          </label>
          <input
            id="departmentName"
            name="departmentName"
            value={values.departmentName}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Enter department name"
          />
        </div>

        <div>
          <label htmlFor="departmentDescription" className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="departmentDescription"
            name="departmentDescription"
            value={values.departmentDescription}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Enter department description"
          />
        </div>

        {mode === 'edit' && (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              checked={Boolean(values.isActive)}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
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
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {isLoading
              ? (mode === 'create' ? 'Creating...' : 'Saving...')
              : (mode === 'create' ? 'Create Department' : 'Save Changes')}
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
