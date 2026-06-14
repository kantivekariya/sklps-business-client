import { useEffect, useState } from "react";
import type { Job } from "@/types";
import { jobsService } from "./jobs.service";
import { JobsList } from "./jobs-list";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsService
      .getApproved()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Global Job Portal</h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-foreground/90">
              Find verified job opportunities across India, Kenya, Middle East, and beyond
            </p>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <JobsList initialJobs={jobs} />
      )}
    </div>
  );
}
