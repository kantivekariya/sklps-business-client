import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Job } from "@/types";
import { JobDetails } from "./job-details";
import { jobsService } from "./jobs.service";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    jobsService
      .getById(id)
      .then(setJob)
      .catch(() => navigate("/jobs", { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!job) return null;

  return <JobDetails job={job} />;
}
