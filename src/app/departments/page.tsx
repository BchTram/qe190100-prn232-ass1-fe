'use client';

import { useEffect, useMemo, useState } from 'react';
import DepartmentForm from '@/components/DepartmentForm';
import DepartmentTable from '@/components/DepartmentTable';
import { departmentApi } from '@/services/departmentApi';
import type { Department, DepartmentCreateRequest, DepartmentUpdateRequest } from '@/types/department';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editingDepartment = useMemo(
    () => departments.find((department) => department.departmentId === editingId) ?? null,
    [departments, editingId],
  );

  const loadDepartments = async (keyword?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = keyword && keyword.trim()
        ? await departmentApi.search(keyword.trim())
        : await departmentApi.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load departments.');
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDepartments();
  }, []);

  const handleSearch = async () => {
    await loadDepartments(searchTerm);
  };

  const handleCreate = async (values: DepartmentCreateRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const created = await departmentApi.create(values);
      setDepartments((prev) => [created, ...prev]);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create department.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: DepartmentUpdateRequest) => {
    if (editingId === null) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await departmentApi.update(editingId, values);
      setDepartments((prev) =>
        prev.map((department) =>
          department.departmentId === editingId ? updated : department,
        ),
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update department.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (values: DepartmentCreateRequest | DepartmentUpdateRequest) => {
    if (editingId !== null) {
      await handleUpdate(values as DepartmentUpdateRequest);
      return;
    }

    await handleCreate(values as DepartmentCreateRequest);
  };

  const handleEdit = (department: Department) => {
    setEditingId(department.departmentId);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const handleDelete = async (departmentId: number) => {
    const department = departments.find((item) => item.departmentId === departmentId);
    if (!department) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${department.departmentName}"?`,
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await departmentApi.remove(departmentId);
      setDepartments((prev) =>
        prev.filter((item) => item.departmentId !== departmentId),
      );
      if (editingId === departmentId) {
        setEditingId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete department.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Management</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Departments</h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-xl items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleSearch();
                  }
                }}
                placeholder="Search departments..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="button"
                onClick={() => void handleSearch()}
                className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700"
              >
                Search
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setError(null);
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              New Department
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <DepartmentForm
              mode={editingId !== null ? 'edit' : 'create'}
              initialValues={
                editingDepartment
                  ? {
                      departmentName: editingDepartment.departmentName,
                      departmentDescription: editingDepartment.departmentDescription ?? '',
                      isActive: editingDepartment.isActive,
                    }
                  : undefined
              }
              isLoading={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
            />
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            <DepartmentTable
              departments={departments}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
