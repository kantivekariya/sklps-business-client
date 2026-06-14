import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ApplicantsList } from "@/modules/jobs/applicants-list";
import type { Job } from "@/types";
import { businessDashboardService } from "./business-dashboard.service";
import { BusinessJobCard } from "./business-job-card";

export default function DashboardJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    businessDashboardService
      .getMyJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Jobs</h1>
          <p className="mt-1 text-muted-foreground">Manage your job listings</p>
        </div>
        <Link to="/business-dashboard/jobs/post">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post a Job
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card py-20 text-center">
          <p className="text-muted-foreground">No jobs posted yet.</p>
          <Link to="/business-dashboard/jobs/post">
            <Button variant="link" className="mt-2">
              Post your first job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <BusinessJobCard key={job._id} job={job} onViewApplicants={(j) => setSelectedJob(j)} />
          ))}
        </div>
      )}

      {selectedJob && (
        <ApplicantsList
          jobId={selectedJob._id}
          jobTitle={selectedJob.jobTitle}
          open={!!selectedJob}
          onOpenChange={(open) => !open && setSelectedJob(null)}
        />
      )}
    </div>
  );
}
