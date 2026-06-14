import { ArrowLeft, Briefcase, Calendar, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateDDMMMYYYY } from "@/lib/date-utils";
import { ApplicantsList } from "@/modules/jobs/applicants-list";
import type { Job } from "@/types";
import { businessDashboardService } from "./business-dashboard.service";

export default function BusinessJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicantsOpen, setApplicantsOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    businessDashboardService
      .getJobById(id)
      .then(setJob)
      .catch(() => navigate("/business-dashboard/jobs", { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!job) return null;

  const statusColor =
    job.status === "Approved"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
      : job.status === "Pending"
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/business-dashboard/jobs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{job.jobTitle}</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColor}`}>
          {job.status}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Category:</span>
            <span className="font-medium">{job.category}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">
              {job.city}, {job.country}
            </span>
          </div>
          {job.createdAt && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Posted:</span>
              <span className="font-medium">{formatDateDDMMMYYYY(job.createdAt)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Job Type:</span>
            <span className="font-medium">{job.jobType}</span>
          </div>
          {job.salaryRange && (
            <div className="text-sm">
              <span className="text-muted-foreground">Salary: </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {job.salaryRange}
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {job.accommodation && <Badge variant="secondary">Accommodation</Badge>}
            {job.visaSupport && <Badge variant="secondary">Visa Support</Badge>}
          </div>
        </CardContent>
      </Card>

      {job.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line leading-relaxed text-foreground/90">
              {job.description}
            </p>
          </CardContent>
        </Card>
      )}

      {job.skillsRequired && job.skillsRequired.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {job.skillsRequired.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <Button onClick={() => setApplicantsOpen(true)}>
        <Users className="mr-2 h-4 w-4" />
        View Applicants
      </Button>

      <ApplicantsList
        jobId={job._id}
        jobTitle={job.jobTitle}
        open={applicantsOpen}
        onOpenChange={setApplicantsOpen}
      />
    </div>
  );
}
