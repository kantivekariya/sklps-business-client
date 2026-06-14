"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBusinessAuth } from "@/context/business-auth-context";

interface BusinessRouteProps {
  children: React.ReactNode;
}

export function BusinessRoute({ children }: BusinessRouteProps) {
  const { business, loading } = useBusinessAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (business) return;
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/");
      return;
    }
    router.replace("/business-login");
  }, [business, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!business) {
    return null;
  }

  return <>{children}</>;
}
