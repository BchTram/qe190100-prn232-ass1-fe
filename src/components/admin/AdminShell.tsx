"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Building2, CircleCheck, LayoutDashboard, LogOut, Search, Tags, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type MenuItem = { href: string; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean };
const menu: MenuItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/departments", label: "Departments", icon: Building2 },
  { href: "/admin/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/admin/tasks", label: "Tasks", icon: CircleCheck },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/search", label: "Search", icon: Search },
  { href: "/admin/accounts", label: "Accounts", icon: Users, adminOnly: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, role, loading, logout } = useAuth();
  const items = menu.filter((item) => !item.adminOnly || role === 1);

  const navigation = (compact = false) => items.map(({ href, label, icon: Icon }) => {
    const active = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link key={href} href={href} aria-current={active ? "page" : undefined} title={compact ? label : undefined}
        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${active ? "bg-white/12 text-white" : "text-slate-300 hover:bg-white/8 hover:text-white"} ${compact ? "shrink-0" : ""}`}>
        <Icon aria-hidden="true" className="size-[18px] shrink-0" />
        <span>{label}</span>
      </Link>
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="hidden min-h-screen flex-col bg-slate-950 px-4 py-5 text-white md:flex">
        <Link href="/admin" className="mb-9 flex items-center gap-3 px-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-md bg-blue-600"><LayoutDashboard className="size-5" /></span>
          <span>TaskTrack</span>
        </Link>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase text-slate-400">Workspace</p>
        <nav className="flex flex-col gap-1">{navigation()}</nav>
        <div className="mt-auto border-t border-white/10 px-3 pt-4 text-xs text-slate-400">Operations workspace</div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 md:hidden">
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-blue-600 text-white"><LayoutDashboard className="size-5" /></span>
              <span className="truncate text-sm font-semibold text-slate-900">TaskTrack</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-950">Workspace</p>
              <p className="text-xs text-slate-500">Manage your organization</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
              {loading ? (
                <span aria-hidden="true" className="h-9 w-28" />
              ) : currentUser ? (
                <>
                  <div className="max-w-24 text-right sm:max-w-52">
                    <p className="truncate text-xs font-medium text-slate-900 sm:text-sm">{currentUser.fullName}</p>
                    <p className="hidden max-w-52 truncate text-xs text-slate-500 sm:block">{currentUser.email}</p>
                  </div>
                  <span className="hidden rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 sm:inline-flex">{role === 1 ? "Admin" : "Member"}</span>
                  <Button type="button" variant="outline" size="sm" onClick={logout} aria-label="Log out" title="Log out" className="gap-1.5 px-2 sm:gap-2 sm:px-3">
                    <LogOut className="size-4" /><span className="hidden sm:inline">Log out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" nativeButton={false} variant="outline" size="sm" className="px-2.5 sm:px-3" render={<Link href="/login" />}>
                    Sign In
                  </Button>
                  <Button type="button" nativeButton={false} size="sm" className="bg-blue-600 px-2.5 text-white hover:bg-blue-700 sm:px-3" render={<Link href="/register" />}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
          <nav aria-label="Workspace navigation" className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 md:hidden">{navigation(true)}</nav>
        </header>
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
