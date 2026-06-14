"use client";

import { Briefcase, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BusinessJobCard } from "@/components/business/business-job-card";
import { ApplicantsList } from "@/components/jobs/applicants-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import api, { API_ENDPOINTS } from "@/lib/api";

interface Job {
  _id: string;
  jobTitle: string;
  companyName: string;
  category: string;
  city: string;
  country: string;
  jobType: string;
  status: string;
  createdAt: string;
  applicationsCount?: number;
}

export default function BusinessJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [applicantsOpen, setApplicantsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null);
  const { toast } = useToast();

  const limit = 6;

  const fetchJobs = async () => {
    try {
      const res = await api.get<{ data: Job[]; total: number; page: number; totalPages: number } | Job[]>(
        `${API_ENDPOINTS.JOB_BUSINESS_MINE}?page=${page}&limit=${limit}`
      );
      const data = res.data;
      if (data && typeof data === "object" && "data" in data) {
        setJobs(data.data ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 0);
      } else {
        setJobs(Array.isArray(data) ? data : []);
        setTotal(Array.isArray(data) ? data.length : 0);
        setTotalPages(1);
      }
    } catch {
      setJobs([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchJobs();
  }, [page]);

  const handleCloseJob = async (id: string) => {
    try {
      await api.patch(API_ENDPOINTS.JOB_CLOSE(id));
      toast({ title: "Job closed", description: "The job has been closed successfully." });
      fetchJobs();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast({
        title: "Failed to close job",
        description: e.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleViewApplicants = (jobId: string, jobTitle: string) => {
    setSelectedJob({ id: jobId, title: jobTitle });
    setApplicantsOpen(true);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
          <p className="text-muted-foreground">Post and manage your job listings</p>
        </div>
        <Link href="/business-dashboard/jobs/post">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Post Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
            <CardTitle className="mb-2">No jobs yet</CardTitle>
            <CardDescription>Get started by posting your first job.</CardDescription>
            <Link href="/business-dashboard/jobs/post">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Post Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {jobs.map((job) => (
              <BusinessJobCard
                key={job._id}
                job={job}
                onCloseJob={handleCloseJob}
                onViewApplicants={handleViewApplicants}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} jobs)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedJob && (
        <ApplicantsList
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          open={applicantsOpen}
          onOpenChange={setApplicantsOpen}
        />
      )}
    </div>
  );
}
