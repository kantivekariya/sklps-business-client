"use client";

import { BusinessLayout } from "@/components/business/business-layout";
import { BusinessRoute } from "@/components/shared/business-route";

export default function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessRoute>
      <BusinessLayout>{children}</BusinessLayout>
    </BusinessRoute>
  );
}
