import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/modules/business/business-card";
import type { Business } from "@/types";

interface HomeContentProps {
  latestBusinesses: Business[];
  loading?: boolean;
}

export function HomeContent({ latestBusinesses, loading }: HomeContentProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

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
      <Link to="/add-business" className="mt-4">
        <Button>Add Business</Button>
      </Link>
    </div>
  );
}
