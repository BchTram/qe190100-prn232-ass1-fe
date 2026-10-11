import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-12">
      <section className="w-full max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-xl bg-rose-50 text-rose-700"><ShieldX className="size-7" /></span>
        <p className="mt-6 text-sm font-semibold text-blue-700">403 · ACCESS DENIED</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">You don&apos;t have access to this resource</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Your account may not have the required role. Contact an administrator if you believe this is a mistake.</p>
        <Link href="/admin" className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">Return to workspace</Link>
      </section>
    </main>
  );
}
