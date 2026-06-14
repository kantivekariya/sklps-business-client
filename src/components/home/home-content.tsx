"use client";

import Link from "next/link";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import type { Business } from "@/types";

interface HomeContentProps {
  latestBusinesses: Business[];
  latestJobs: unknown[];
}

export function HomeContent({ latestBusinesses }: HomeContentProps) {
  if (latestBusinesses.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {latestBusinesses.map((business) => (
          <BusinessCard key={business._id} business={business} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-20 text-center shadow-sm">
      <p className="text-lg text-muted-foreground">No businesses added yet. Be the first!</p>
      <Link href="/add" className="mt-4">
        <Button>Add Business</Button>
      </Link>
    </div>
  );
}
