import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-12">
      <section className="w-full max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-xl bg-blue-50 text-blue-700"><SearchX className="size-7" /></span>
        <p className="mt-6 text-sm font-semibold text-blue-700">404 · NOT FOUND</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">We couldn&apos;t find that page</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">The address may be incorrect or the page may have moved.</p>
        <Link href="/admin" className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">Go to dashboard</Link>
      </section>
    </main>
  );
}
