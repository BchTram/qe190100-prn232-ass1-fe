"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, Tags, Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { departmentApi } from "@/services/departmentApi";
import { projectApi } from "@/services/projectApi";
import { taskApi } from "@/services/taskApi";
import { tagApi } from "@/services/tagApi";
import { accountApi } from "@/services/accountApi";

const areas = [
  { label: "Departments", href: "/admin/departments", detail: "Organize teams and ownership.", icon: Building2, color: "text-cyan-700 bg-cyan-50" },
  { label: "Projects", href: "/admin/projects", detail: "Review initiatives and delivery status.", icon: BriefcaseBusiness, color: "text-orange-700 bg-orange-50" },
  { label: "Tasks", href: "/admin/tasks", detail: "Keep execution visible and current.", icon: CheckCircle2, color: "text-emerald-700 bg-emerald-50" },
  { label: "Tags", href: "/admin/tags", detail: "Maintain labels across the workspace.", icon: Tags, color: "text-rose-700 bg-rose-50" },
];

type Counts = { departments: number | null; projects: number | null; tasks: number | null; accounts: number | null; tags: number | null };
const initialCounts: Counts = { departments: null, projects: null, tasks: null, accounts: null, tags: null };

export default function AdminDashboardPage() {
  const { role, currentUser } = useAuth();
  const [counts, setCounts] = useState(initialCounts);

  useEffect(() => {
    let active = true;
    const requests = [
      departmentApi.getAll().then((data) => data.length).catch(() => null),
      projectApi.getAll().then((data) => data.length).catch(() => null),
      taskApi.getAll().then((data) => data.length).catch(() => null),
      tagApi.getAll().then((data) => data.length).catch(() => null),
      role === 1 ? accountApi.getAll().then((data) => data.length).catch(() => null) : Promise.resolve(null),
    ];
    void Promise.all(requests).then(([departments, projects, tasks, tags, accounts]) => {
      if (active) setCounts({ departments, projects, tasks, tags, accounts });
    });
    return () => { active = false; };
  }, [role]);

  if (!currentUser) return <LoadingSpinner />;

  const stats = [
    { title: "Total Departments", value: counts.departments ?? "—", detail: "Teams across the organization", icon: Building2, iconClassName: "bg-cyan-50 text-cyan-700" },
    { title: "Total Projects", value: counts.projects ?? "—", detail: "Initiatives in the workspace", icon: BriefcaseBusiness, iconClassName: "bg-orange-50 text-orange-700" },
    { title: "Total Tasks", value: counts.tasks ?? "—", detail: "Tracked work items", icon: CheckCircle2, iconClassName: "bg-emerald-50 text-emerald-700" },
    { title: "Total Accounts", value: role === 1 ? counts.accounts ?? "—" : "Admin", detail: role === 1 ? "Registered staff accounts" : "Restricted to administrators", icon: Users, iconClassName: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description={`Welcome back, ${currentUser.fullName}. Here's your workspace at a glance.`} />
      <section aria-label="Workspace statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </section>
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div><h2 className="text-lg font-semibold text-slate-950">Workspace overview</h2><p className="mt-1 text-sm text-slate-600">Open an area to review and manage records.</p></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {areas.map(({ label, href, detail, icon: Icon, color }) => (
            <Link key={href} href={href} className="group flex min-h-36 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
              <div className="flex items-center justify-between"><span className={`grid size-10 place-items-center rounded-md ${color}`}><Icon className="size-5" /></span><ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" /></div>
              <h3 className="mt-4 text-sm font-semibold text-slate-950">{label}</h3><p className="mt-1 text-sm text-slate-600">{detail}</p>
            </Link>
          ))}
          {role === 1 && <Link href="/admin/accounts" className="group flex min-h-36 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-md bg-blue-50 text-blue-700"><Users className="size-5" /></span><ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" /></div><h3 className="mt-4 text-sm font-semibold text-slate-950">Accounts</h3><p className="mt-1 text-sm text-slate-600">Manage staff and access roles.</p></Link>}
        </div>
      </section>
    </div>
  );
}
