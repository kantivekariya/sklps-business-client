"use client";

import { usePathname } from "next/navigation";
import { PrivateRoute } from "@/components/shared/private-route";
import { AdminLayout } from "./admin-layout";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <PrivateRoute>
      <AdminLayout>{children}</AdminLayout>
    </PrivateRoute>
  );
}
