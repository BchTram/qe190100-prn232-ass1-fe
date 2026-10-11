"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute><AdminShell>{children}</AdminShell></ProtectedRoute>;
}
