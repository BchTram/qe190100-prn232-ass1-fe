'use client';

import { useEffect, useState } from 'react';
import { departmentApi } from '@/services/departmentApi';
import { projectApi } from '@/services/projectApi';
import { taskApi } from '@/services/taskApi';
import type { Department } from '@/types/department';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';

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

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<number | ''>('');
  const [priority, setPriority] = useState<number | ''>('');
  const [projectId, setProjectId] = useState<number | ''>('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDropdowns = async () => {
    try {
      const [departmentData, projectData] = await Promise.all([
        departmentApi.getAll(),
        projectApi.getAll(),
      ]);

      setDepartments(departmentData);
      setProjects(projectData);
    } catch {
      setDepartments([]);
      setProjects([]);
    }
  };

  useEffect(() => {
    void loadDropdowns();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [departmentResult, projectResult, taskResult] = await Promise.all([
        departmentApi.search(keyword || undefined),
        projectApi.search(keyword || undefined),
        taskApi.search({
          keyword: keyword || undefined,
          status: status === '' ? undefined : Number(status),
          priority: priority === '' ? undefined : Number(priority),
          projectId: projectId === '' ? undefined : Number(projectId),
        }),
      ]);

      setDepartments(departmentResult);
      setProjects(projectResult);
      setTasks(taskResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.');
      setDepartments([]);
      setProjects([]);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-600">Global Search</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Search</h1>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Keyword"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value === '' ? '' : Number(event.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              >
                <option value="">All statuses</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={Number(key)}>{label}</option>
                ))}
              </select>

              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value === '' ? '' : Number(event.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              >
                <option value="">All priorities</option>
                {Object.entries(priorityLabels).map(([key, label]) => (
                  <option key={key} value={Number(key)}>{label}</option>
                ))}
              </select>

              <select
                value={projectId}
                onChange={(event) => setProjectId(event.target.value === '' ? '' : Number(event.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              >
                <option value="">All projects</option>
                {projects.map((project) => (
                  <option key={project.projectId} value={project.projectId}>{project.projectName}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => void handleSearch()}
                className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Departments</h2>
            {isLoading ? (
              <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-500">Loading...</div>
            ) : !departments.length ? (
              <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-500">No departments found.</div>
            ) : (
              <ul className="space-y-3">
                {departments.map((department) => (
                  <li key={department.departmentId} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="font-medium text-slate-900">{department.departmentName}</div>
                    <div className="mt-1 text-sm text-slate-600">{department.departmentDescription || 'No description'}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Projects</h2>
            {isLoading ? (
              <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-500">Loading...</div>
            ) : !projects.length ? (
              <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-500">No projects found.</div>
            ) : (
              <ul className="space-y-3">
                {projects.map((project) => (
                  <li key={project.projectId} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="font-medium text-slate-900">{project.projectName}</div>
                    <div className="mt-1 text-sm text-slate-600">{project.startDate} - {project.endDate || 'Ongoing'}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Tasks</h2>
            {isLoading ? (
              <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-500">Loading...</div>
            ) : !tasks.length ? (
              <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-500">No tasks found.</div>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li key={task.taskId} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="font-medium text-slate-900">{task.title}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {statusLabels[task.status] ?? 'Unknown'} · {priorityLabels[task.priority] ?? 'Unknown'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
