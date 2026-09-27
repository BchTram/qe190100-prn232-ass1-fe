'use client';

import { useEffect, useMemo, useState } from 'react';
import ProjectForm, { type ProjectFormValues } from '@/components/ProjectForm';
import ProjectTable from '@/components/ProjectTable';
import { departmentApi } from '@/services/departmentApi';
import { projectApi } from '@/services/projectApi';
import type { Department } from '@/types/department';
import type { Project, ProjectCreateRequest, ProjectUpdateRequest } from '@/types/project';

const projectStatusLabel: Record<number, string> = {
  0: 'Not Started',
  1: 'In Progress',
  2: 'Completed',
  3: 'On Hold',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<number | ''>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editingProject = useMemo(
    () => projects.find((project) => project.projectId === editingId) ?? null,
    [projects, editingId],
  );

  const fetchDepartments = async () => {
    try {
      const data = await departmentApi.getAll();
      setDepartments(data);
    } catch {
      setDepartments([]);
    }
  };

  const loadProjects = async (keyword?: string, selectedDepartment?: number | '') => {
    setIsLoading(true);
    setError(null);

    try {
      let data: Project[] = [];

      if (keyword && keyword.trim()) {
        data = await projectApi.search(keyword.trim());
      } else if (selectedDepartment && Number(selectedDepartment) > 0) {
        data = await projectApi.getByDepartmentId(Number(selectedDepartment));
      } else {
        data = await projectApi.getAll();
      }

      if (selectedDepartment && Number(selectedDepartment) > 0) {
        data = data.filter((project) => project.departmentId === Number(selectedDepartment));
      }

      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects.');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchDepartments();
    void loadProjects();
  }, []);

  const handleSearch = async () => {
    await loadProjects(searchTerm, departmentFilter);
  };

  const handleCreate = async (values: ProjectCreateRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const created = await projectApi.create(values);
      setProjects((prev) => [created, ...prev]);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create project.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: ProjectUpdateRequest) => {
    if (editingId === null) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await projectApi.update(editingId, values);
      setProjects((prev) =>
        prev.map((project) =>
          project.projectId === editingId ? updated : project,
        ),
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update project.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    const payload: ProjectCreateRequest = {
      projectName: values.projectName,
      description: values.description || undefined,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      status: Number(values.status),
      departmentId: Number(values.departmentId),
    };

    if (editingId !== null) {
      await handleUpdate({
        ...payload,
        isActive: values.isActive ?? true,
      });
      return;
    }

    await handleCreate(payload);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.projectId);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const handleDelete = async (projectId: number) => {
    const project = projects.find((item) => item.projectId === projectId);
    if (!project) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.projectName}"?`,
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await projectApi.remove(projectId);
      setProjects((prev) => prev.filter((item) => item.projectId !== projectId));
      if (editingId === projectId) {
        setEditingId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete project.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Planning</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Projects</h1>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleSearch();
                  }
                }}
                placeholder="Search projects..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 md:w-64"
              />

              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value === '' ? '' : Number(event.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="">All departments</option>
                {departments.map((department) => (
                  <option key={department.departmentId} value={department.departmentId}>
                    {department.departmentName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => void handleSearch()}
                className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <ProjectForm
              mode={editingId !== null ? 'edit' : 'create'}
              departments={departments}
              initialValues={
                editingProject
                  ? {
                      projectName: editingProject.projectName,
                      description: editingProject.description ?? '',
                      startDate: editingProject.startDate,
                      endDate: editingProject.endDate ?? '',
                      status: editingProject.status,
                      departmentId: editingProject.departmentId,
                      isActive: editingProject.isActive,
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

            <ProjectTable
              projects={projects}
              departments={departments}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              statusLabelMap={projectStatusLabel}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
