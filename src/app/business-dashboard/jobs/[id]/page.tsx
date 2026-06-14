"use client";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  Lock,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApplicantsList } from "@/components/jobs/applicants-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import api, { API_ENDPOINTS } from "@/lib/api";
import { formatDateDDMMMYYYY } from "@/lib/date-utils";

interface Job {
  _id: string;
  jobTitle: string;
  companyName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  city: string;
  country: string;
  category: string;
  jobType: string;
  experienceRequired: string;
  description: string;
  salaryRange?: string;
  status: string;
  createdAt: string;
}

export default function BusinessJobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [applicationsCount, setApplicationsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicantsOpen, setApplicantsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        const { data } = await api.get<Job>(API_ENDPOINTS.JOB_BY_ID(id));
        setJob(data);
      } catch {
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!job) return;
    const fetchCount = async () => {
      try {
        const { data } = await api.post<{ total: number }>(API_ENDPOINTS.JOB_APPLICANTS_LIST, {
          jobId: job._id,
          page: 1,
          limit: 1,
        });
        setApplicationsCount(data.total ?? 0);
      } catch {
        setApplicationsCount(0);
      }
    };
    fetchCount();
  }, [job?._id]);

  const handleCloseJob = async () => {
    if (!job) return;
    try {
      await api.patch(API_ENDPOINTS.JOB_CLOSE(job._id));
      toast({ title: "Job closed", description: "The job has been closed successfully." });
      setJob((prev) => (prev ? { ...prev, status: "Closed" } : null));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast({
        title: "Failed to close job",
        description: e.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
      case "Pending":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
      case "Rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "Closed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/business-dashboard/jobs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Job not found
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={() => router.push("/business-dashboard/jobs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setApplicantsOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            View Applicants ({applicationsCount ?? "—"})
          </Button>
          {job.status === "Approved" && (
            <Button variant="outline" size="sm" onClick={handleCloseJob} className="text-amber-600">
              <Lock className="mr-2 h-4 w-4" />
              Close Job
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={statusColor(job.status)}>{job.status}</Badge>
            <Badge variant="outline">{job.category}</Badge>
            <Badge variant="outline">{job.jobType}</Badge>
          </div>
          <CardTitle className="text-2xl">{job.jobTitle}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {job.companyName}
          </CardDescription>
          <div className="text-sm text-muted-foreground">
            Posted {formatDateDDMMMYYYY(job.createdAt)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{job.city}, {job.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{job.experienceRequired}</span>
            </div>
            {job.salaryRange && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{job.salaryRange}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <p className="text-sm text-muted-foreground">{job.contactPerson}</p>
            <p className="text-sm">{job.email}</p>
            <p className="text-sm text-muted-foreground">{job.mobile}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <div className="rounded-md border bg-muted/50 p-4 text-sm whitespace-pre-wrap">
              {job.description}
            </div>
          </div>
        </CardContent>
      </Card>

      <ApplicantsList
        jobId={job._id}
        jobTitle={job.jobTitle}
        open={applicantsOpen}
        onOpenChange={setApplicantsOpen}
      />
    </div>
  );
}
