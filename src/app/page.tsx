'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { departmentApi } from '@/services/departmentApi';
import { projectApi } from '@/services/projectApi';
import { taskApi } from '@/services/taskApi';
import { tagApi } from '@/services/tagApi';

type IconName = 'departments' | 'projects' | 'tasks' | 'tags' | 'search';
type CountKey = 'departments' | 'projects' | 'tasks' | 'tags';

const navigationItems: {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  accent: string;
}[] = [
  {
    title: 'Departments',
    description: 'Organize your people and teams in one place.',
    href: '/departments',
    icon: 'departments',
    accent: 'bg-cyan-100 text-cyan-800',
  },
  {
    title: 'Projects',
    description: 'Keep initiatives structured and moving forward.',
    href: '/projects',
    icon: 'projects',
    accent: 'bg-orange-100 text-orange-800',
  },
  {
    title: 'Tasks',
    description: 'Track the work that turns plans into progress.',
    href: '/tasks',
    icon: 'tasks',
    accent: 'bg-emerald-100 text-emerald-800',
  },
  {
    title: 'Tags',
    description: 'Add useful labels to connect related work.',
    href: '/tags',
    icon: 'tags',
    accent: 'bg-rose-100 text-rose-800',
  },
  {
    title: 'Search',
    description: 'Find a department, project, or task quickly.',
    href: '/search',
    icon: 'search',
    accent: 'bg-indigo-100 text-indigo-800',
  },
];

const statItems: { label: string; key: CountKey; accent: string }[] = [
  { label: 'Departments', key: 'departments', accent: 'bg-cyan-500' },
  { label: 'Projects', key: 'projects', accent: 'bg-orange-500' },
  { label: 'Tasks', key: 'tasks', accent: 'bg-emerald-500' },
  { label: 'Tags', key: 'tags', accent: 'bg-rose-500' },
];

function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    departments: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 20V9h6v11M7 8h.01M17 8h.01M7 12h.01M17 12h.01" />
      </>
    ),
    projects: (
      <>
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H10l2 2h5.5A2.5 2.5 0 0 1 20 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z" />
        <path d="M8 13h8M8 16h5" />
      </>
    ),
    tasks: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="m8 12 2.5 2.5L16 9M8 7h.01" />
      </>
    ),
    tags: (
      <>
        <path d="M20 13 13 20l-9-9V4h7z" />
        <circle cx="8.5" cy="8.5" r="1" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 transition-transform duration-200 group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  const [counts, setCounts] = useState<Record<CountKey, number | '—' | null>>({
    departments: null,
    projects: null,
    tasks: null,
    tags: null,
  });

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      departmentApi.getAll().then((items) => items.length).catch(() => '—' as const),
      projectApi.getAll().then((items) => items.length).catch(() => '—' as const),
      taskApi.getAll().then((items) => items.length).catch(() => '—' as const),
      tagApi.getAll().then((items) => items.length).catch(() => '—' as const),
    ]).then(([departments, projects, tasks, tags]) => {
      if (isActive) {
        setCounts({ departments, projects, tasks, tags });
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Task Management System home">
            <span className="grid size-10 place-items-center rounded-xl bg-[#153b3a] text-white shadow-sm">
              <Icon name="tasks" className="size-5" />
            </span>
            <span className="text-sm font-bold tracking-normal text-slate-900 sm:text-base">
              Task Management System
            </span>
          </Link>
          <Link
            href="/search"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176f69]"
          >
            <Icon name="search" className="size-4" />
            <span className="hidden sm:inline">Search workspace</span>
            <span className="sm:hidden">Search</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-10 pt-7 sm:px-8 sm:pt-10">
        <section className="relative isolate overflow-hidden rounded-2xl bg-[#153b3a] px-6 py-8 text-white shadow-[0_18px_45px_-28px_rgba(21,59,58,0.65)] sm:px-9 sm:py-10 lg:px-12 lg:py-11">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/5 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(90deg,transparent,black)]"
          />
          <div className="grid items-center gap-9 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase text-teal-200">
                Your workspace, in sync
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                Task Management System
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/85 sm:text-base">
                Manage Departments, Projects, Tasks and Tags efficiently.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2.5">
                <span className="mr-1 text-xs font-semibold text-teal-100">Built with</span>
                {['Next.js', 'ASP.NET Core', 'PostgreSQL', 'Render', 'Vercel'].map((technology) => (
                  <span
                    key={technology}
                    className="rounded-md border border-white/15 bg-white/8 px-2.5 py-1.5 text-xs font-medium text-white/95"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/tasks"
              className="group inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-lg bg-[#d5f06e] px-5 text-sm font-bold text-[#193b34] transition hover:bg-[#e2f796] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:self-center"
            >
              Go to tasks
              <ArrowIcon />
            </Link>
          </div>
        </section>

        <section aria-labelledby="overview-title" className="mt-9">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#287a72]">At a glance</p>
              <h2 id="overview-title" className="mt-1 text-xl font-bold text-slate-900">
                Workspace overview
              </h2>
            </div>
            <span className="hidden text-xs text-slate-500 sm:block">Live record counts</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {statItems.map((item) => {
              const count = counts[item.key];
              return (
                <div
                  key={item.key}
                  aria-busy={count === null}
                  className="relative min-h-28 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_12px_-8px_rgba(15,23,42,.2)] sm:p-5"
                >
                  <span className={`absolute inset-y-0 left-0 w-1 ${item.accent}`} />
                  <p className="text-sm font-medium text-slate-600">{item.label}</p>
                  {count === null ? (
                    <span className="mt-3 block h-8 w-12 animate-pulse rounded-md bg-slate-100" aria-label="Loading count" />
                  ) : (
                    <p className="mt-2 text-2xl font-bold text-slate-900" aria-label={`${item.label}: ${count}`}>
                      {count}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="manage-title" className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#287a72]">Manage your work</p>
              <h2 id="manage-title" className="mt-1 text-xl font-bold text-slate-900">
                Workspace areas
              </h2>
            </div>
            <span className="hidden text-xs text-slate-500 sm:block">Choose an area to get started</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-48 flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_3px_12px_-8px_rgba(15,23,42,.2)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176f69] sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <span className={`grid size-11 place-items-center rounded-xl ${item.accent}`}>
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <ArrowIcon />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-5 text-slate-600">{item.description}</p>
                <span className="mt-auto pt-5 text-sm font-semibold text-[#176f69]">
                  Open {item.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Developed for PRN232 Assignment</span>
          <span>Task Management System</span>
        </div>
      </footer>
    </main>
  );
}
