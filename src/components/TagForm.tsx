'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

export type TagFormValues = {
  tagName: string;
  color: string;
};

type TagFormProps = {
  mode: 'create' | 'edit';
  initialValues?: Partial<TagFormValues>;
  isLoading?: boolean;
  onSubmit: (values: TagFormValues) => Promise<void>;
  onCancel?: () => void;
};

const defaultValues: TagFormValues = {
  tagName: '',
  color: '#3b82f6',
};

export default function TagForm({
  mode,
  initialValues,
  isLoading = false,
  onSubmit,
  onCancel,
}: TagFormProps) {
  const [values, setValues] = useState<TagFormValues>({
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tagName = values.tagName.trim();

    if (!tagName) {
      setError('Tag Name is required.');
      return;
    }

    setError(null);
    await onSubmit({
      ...values,
      tagName,
      color: values.color || '#3b82f6',
    });
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {mode === 'create' ? 'Create Tag' : 'Edit Tag'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tagName" className="mb-1.5 block text-sm font-medium text-slate-700">
            Tag Name
          </label>
          <input
            id="tagName"
            name="tagName"
            value={values.tagName}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="Enter tag name"
          />
        </div>

        <div>
          <label htmlFor="color" className="mb-1.5 block text-sm font-medium text-slate-700">
            Color
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 py-2.5">
            <input
              id="color"
              type="color"
              name="color"
              value={values.color}
              onChange={handleChange}
              className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <span className="text-sm text-slate-600">{values.color}</span>
          </div>
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
            className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-300"
          >
            {isLoading
              ? (mode === 'create' ? 'Creating...' : 'Saving...')
              : (mode === 'create' ? 'Create Tag' : 'Save Changes')}
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
