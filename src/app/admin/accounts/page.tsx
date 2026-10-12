"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Users } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { DataTable, type DataColumn } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { accountApi } from "@/services/accountApi";
import type { Account } from "@/types/auth";

const schema = z.object({
  fullName: z.string().trim().min(1, "Full name is required.").max(200),
  email: z.string().email("Enter a valid email address.").max(320),
  role: z.enum(["0", "1"]),
});
type FormValues = z.infer<typeof schema>;

function AccountsContent() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Account | null>(null);
  const [selected, setSelected] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState<Account | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", role: "0" },
  });

  const loadAccounts = async () => {
    setIsLoading(true);
    setError("");
    try {
      setAccounts(await accountApi.getAll());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadAccounts(); }, []);
  useEffect(() => {
    if (editing) reset({ fullName: editing.fullName, email: editing.email, role: editing.role === 1 ? "1" : "0" });
  }, [editing, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!editing) return;
    setError("");
    try {
      const updated = await accountApi.update(editing.accountId, {
        fullName: values.fullName,
        email: values.email,
        role: Number(values.role),
      });
      setAccounts((current) => current.map((account) => account.accountId === updated.accountId ? updated : account));
      setEditing(null);
      toast.success("Account updated.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update account.");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    setError("");
    try {
      await accountApi.remove(deleting.accountId);
      setAccounts((current) => current.filter((account) => account.accountId !== deleting.accountId));
      setDeleting(null);
      toast.success("Account deleted.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete account.");
      setDeleting(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: DataColumn<Account>[] = [
    { key: "name", header: "Account", render: (account) => <button type="button" onClick={() => setSelected(account)} className="font-medium text-slate-900 hover:text-blue-700">{account.fullName}</button> },
    { key: "email", header: "Email", render: (account) => <span>{account.email}</span> },
    { key: "role", header: "Role", render: (account) => <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${account.role === 1 ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"}`}>{account.role === 1 ? "Admin" : "Staff"}</span> },
    { key: "created", header: "Created", render: (account) => <span>{account.createdDate ? new Date(account.createdDate).toLocaleDateString() : "—"}</span> },
    { key: "actions", header: "Actions", render: (account) => <div className="flex items-center gap-1">
      <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${account.fullName}`} title="Edit account" onClick={() => setEditing(account)}><Pencil className="size-4" /></Button>
      <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${account.fullName}`} title="Delete account" onClick={() => setDeleting(account)} className="text-rose-700 hover:text-rose-800"><Trash2 className="size-4" /></Button>
    </div> },
  ];

  return (
    <>
      <PageHeader title="Accounts" description="Manage staff accounts and administrator access." actions={<span className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200"><Users className="size-4" />{accounts.length} accounts</span>} />
      {error && <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">{error}</div>}
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {isLoading ? <DataTable rows={[]} columns={columns} getRowKey={(account) => account.accountId} loading /> : accounts.length ? <DataTable rows={accounts} columns={columns} getRowKey={(account) => account.accountId} /> : error ? <ErrorState message={error} onRetry={() => void loadAccounts()} /> : <EmptyState title="No accounts found" description="Registered staff accounts will appear here." />}
      </section>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Account details</DialogTitle><DialogDescription>Workspace account record.</DialogDescription></DialogHeader>
          {selected && <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-3 py-2 text-sm">
            <dt className="text-slate-500">Full name</dt><dd className="font-medium text-slate-900">{selected.fullName}</dd>
            <dt className="text-slate-500">Email</dt><dd className="break-all text-slate-900">{selected.email}</dd>
            <dt className="text-slate-500">Role</dt><dd className="text-slate-900">{selected.role === 1 ? "Admin" : "Staff"}</dd>
            <dt className="text-slate-500">Created</dt><dd className="text-slate-900">{selected.createdDate ? new Date(selected.createdDate).toLocaleString() : "—"}</dd>
          </dl>}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit account</DialogTitle><DialogDescription>Update account details and access role.</DialogDescription></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">Full name</label><Input id="fullName" {...register("fullName")} aria-invalid={Boolean(errors.fullName)} className="h-10" />{errors.fullName && <p className="mt-1 text-sm text-rose-700">{errors.fullName.message}</p>}</div>
            <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label><Input id="email" type="email" {...register("email")} aria-invalid={Boolean(errors.email)} className="h-10" />{errors.email && <p className="mt-1 text-sm text-rose-700">{errors.email.message}</p>}</div>
            <div><label htmlFor="role" className="mb-1.5 block text-sm font-medium">Role</label><select id="role" {...register("role")} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"><option value="0">Staff</option><option value="1">Admin</option></select></div>
            <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">{isSubmitting ? "Saving..." : "Save changes"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={Boolean(deleting)} onOpenChange={(open) => { if (!open) setDeleting(null); }} title="Delete account?" description={`This will permanently remove ${deleting?.fullName ?? "this account"}. Accounts with created tasks cannot be deleted.`} pending={isDeleting} onConfirm={() => void confirmDelete()} />
    </>
  );
}

export default function AccountsPage() {
  return <AdminRoute><AccountsContent /></AdminRoute>;
}
