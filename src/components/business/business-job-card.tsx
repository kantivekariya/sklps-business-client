"use client";

import { Lock, MapPin, Pencil, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateDDMMMYYYY } from "@/lib/date-utils";

interface BusinessJobCardProps {
  job: {
    _id: string;
    jobTitle: string;
    companyName: string;
    city: string;
    country: string;
    category?: string;
    jobType?: string;
    status: string;
    createdAt: string;
    applicationsCount?: number;
  };
  onCloseJob?: (id: string) => void;
  onViewApplicants?: (jobId: string, jobTitle: string) => void;
}

export function BusinessJobCard({ job, onCloseJob, onViewApplicants }: BusinessJobCardProps) {
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

  return (
    <Card className="h-full flex flex-col justify-between border-l-4 border-l-primary/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2">{job.jobTitle}</CardTitle>
          <Badge className={`shrink-0 ${statusColor(job.status)}`}>{job.status}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="w-4 h-4 shrink-0" />
          {job.city}, {job.country}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 py-2">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {job.category && <span>{job.category}</span>}
          {job.jobType && (
            <>
              <span>•</span>
              <span>{job.jobType}</span>
            </>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{job.applicationsCount ?? 0} application{(job.applicationsCount ?? 0) !== 1 ? "s" : ""}</span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Posted {formatDateDDMMMYYYY(job.createdAt)}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-4">
        {onViewApplicants && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewApplicants(job._id, job.jobTitle)}
          >
            <Users className="mr-2 h-4 w-4" />
            View Applicants
          </Button>
        )}
        <Link href={`/business-dashboard/jobs/${job._id}`}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            View
          </Button>
        </Link>
        {job.status === "Approved" && onCloseJob && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCloseJob(job._id)}
            className="text-amber-600 hover:text-amber-700"
          >
            <Lock className="mr-2 h-4 w-4" />
            Close
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
