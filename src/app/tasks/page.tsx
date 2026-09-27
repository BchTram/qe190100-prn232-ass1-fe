'use client';

import { useEffect, useMemo, useState } from 'react';
import TaskForm, { type TaskFormValues } from '@/components/TaskForm';
import TaskTable from '@/components/TaskTable';
import { projectApi } from '@/services/projectApi';
import { taskApi } from '@/services/taskApi';
import type { Project } from '@/types/project';
import type { Task, TaskCreateRequest, TaskSearchParams, TaskUpdateRequest } from '@/types/task';

const statusLabels: Record<number, string> = {
  0: 'Open',
  1: 'In Progress',
  2: 'Completed',
  3: 'Blocked',
};

const priorityLabels: Record<number, string> = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Critical',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<number | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<number | ''>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editingTask = useMemo(
    () => tasks.find((task) => task.taskId === editingId) ?? null,
    [tasks, editingId],
  );

  const fetchProjects = async () => {
    try {
      const data = await projectApi.getAll();
      setProjects(data);
    } catch {
      setProjects([]);
    }
  };

  const loadTasks = async (params: TaskSearchParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await taskApi.search(params);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks.');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchProjects();
    void loadTasks();
  }, []);

  const handleSearch = async () => {
    await loadTasks({
      keyword: searchTerm || undefined,
      projectId: projectFilter === '' ? undefined : Number(projectFilter),
      status: statusFilter === '' ? undefined : Number(statusFilter),
      priority: priorityFilter === '' ? undefined : Number(priorityFilter),
    });
  };

  const handleCreate = async (values: TaskCreateRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const created = await taskApi.create(values);
      setTasks((prev) => [created, ...prev]);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create task.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: TaskUpdateRequest) => {
    if (editingId === null) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await taskApi.update(editingId, values);
      setTasks((prev) =>
        prev.map((task) =>
          task.taskId === editingId ? updated : task,
        ),
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update task.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (values: TaskFormValues) => {
    const payload: TaskCreateRequest = {
      title: values.title,
      description: values.description || undefined,
      status: Number(values.status),
      priority: Number(values.priority),
      dueDate: values.dueDate || undefined,
      projectId: Number(values.projectId),
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

  const handleEdit = (task: Task) => {
    setEditingId(task.taskId);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const handleDelete = async (taskId: number) => {
    const task = tasks.find((item) => item.taskId === taskId);
    if (!task) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await taskApi.remove(taskId);
      setTasks((prev) => prev.filter((item) => item.taskId !== taskId));
      if (editingId === taskId) {
        setEditingId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete task.');
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
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Execution</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Tasks</h1>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:flex-wrap">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleSearch();
                  }
                }}
                placeholder="Search tasks..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 md:w-64"
              />

              <select
                value={projectFilter}
                onChange={(event) => setProjectFilter(event.target.value === '' ? '' : Number(event.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">All projects</option>
                {projects.map((project) => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.projectName}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value === '' ? '' : Number(event.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">All statuses</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={Number(key)}>{label}</option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value === '' ? '' : Number(event.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">All priorities</option>
                {Object.entries(priorityLabels).map(([key, label]) => (
                  <option key={key} value={Number(key)}>{label}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => void handleSearch()}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <TaskForm
              mode={editingId !== null ? 'edit' : 'create'}
              projects={projects}
              initialValues={
                editingTask
                  ? {
                      title: editingTask.title,
                      description: editingTask.description ?? '',
                      status: editingTask.status,
                      priority: editingTask.priority,
                      dueDate: editingTask.dueDate ?? '',
                      projectId: editingTask.projectId,
                      isActive: editingTask.isActive,
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

            <TaskTable
              tasks={tasks}
              projects={projects}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              statusLabelMap={statusLabels}
              priorityLabelMap={priorityLabels}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
