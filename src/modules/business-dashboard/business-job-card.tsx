import { Briefcase, Calendar, Eye, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateDDMMMYYYY } from "@/lib/date-utils";
import type { Job } from "@/types";

interface BusinessJobCardProps {
  job: Job;
  onViewApplicants?: (job: Job) => void;
}

export function BusinessJobCard({ job, onViewApplicants }: BusinessJobCardProps) {
  const statusColor =
    job.status === "Approved"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
      : job.status === "Pending"
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

  return (
    <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{job.jobTitle}</CardTitle>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
            {job.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 shrink-0" />
          <span>{job.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>
            {job.city}, {job.country}
          </span>
        </div>
        {job.createdAt && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{formatDateDDMMMYYYY(job.createdAt)}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1 pt-1">
          {job.accommodation && (
            <Badge variant="secondary" className="text-xs">
              Accommodation
            </Badge>
          )}
          {job.visaSupport && (
            <Badge variant="secondary" className="text-xs">
              Visa Support
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Link to={`/business-dashboard/jobs/${job._id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        </Link>
        {onViewApplicants && (
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => onViewApplicants(job)}
          >
            <Users className="mr-2 h-4 w-4" />
            Applicants
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
