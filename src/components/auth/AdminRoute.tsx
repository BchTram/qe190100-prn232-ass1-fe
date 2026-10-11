"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { currentUser, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser && role !== 1) router.replace("/admin");
  }, [currentUser, loading, role, router]);

  if (loading || !currentUser || role !== 1) {
    return <LoadingSpinner label="Checking administrator access" />;
  }
  return children;
}
