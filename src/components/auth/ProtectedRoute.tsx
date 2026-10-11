"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [currentUser, loading, pathname, router]);

  if (loading || !currentUser) return <LoadingSpinner label="Checking your session" />;
  return children;
}
