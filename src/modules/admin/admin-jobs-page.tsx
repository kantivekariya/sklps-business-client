import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Loader2,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { businessService } from "@/modules/business/business.service";
import { ApplicantsList } from "@/modules/jobs/applicants-list";
import type { Business, Job } from "@/types";
import { adminService } from "./admin.service";

function getBusinessName(job: Job): string {
  const biz = job.businessId;
  if (typeof biz === "object" && biz?.businessName) return biz.businessName;
  return job.companyName;
}

export default function AdminJobsPage() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicantsOpen, setApplicantsOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsLimit, setJobsLimit] = useState(10);
  const [jobsPagination, setJobsPagination] = useState<{
    page: number;
    totalPages: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    businessService
      .getAll()
      .then(setBusinesses)
      .catch(() => setBusinesses([]));
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const filters =
          selectedBusinessId !== "all" ? { businessId: selectedBusinessId } : undefined;
        const data = await adminService.getJobsPaged(jobsPage, jobsLimit, filters);
        setJobs(data.data ?? []);
        setJobsPagination({ page: data.page, totalPages: data.totalPages, total: data.total });
      } catch {
        toast({ title: "Error", description: "Failed to load jobs.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [selectedBusinessId, toast, jobsPage, jobsLimit]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset to page 1 when business filter changes
  useEffect(() => {
    setJobsPage(1);
  }, [selectedBusinessId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently DELETE this job?")) return;
    try {
      await adminService.deleteJob(id);
      toast({ title: "Success", description: "Job deleted." });
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setSelectedJob(null);
    } catch {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getBusinessName(j).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Job Management</h1>
        <p className="text-muted-foreground">View jobs by business. No approval required.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:min-w-[200px] sm:max-w-[280px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedBusinessId} onValueChange={setSelectedBusinessId}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Filter by business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Businesses</SelectItem>
              {businesses.map((b) => (
                <SelectItem key={b._id} value={b._id}>
                  {b.businessName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center p-8 rounded-lg border bg-muted/50 text-muted-foreground">
          No jobs found
        </div>
      ) : (
        <Card className="rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell className="font-medium">
                      {job.jobTitle}
                      <div className="text-xs text-muted-foreground md:hidden mt-1">
                        {job.companyName}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{job.companyName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {job.city}, {job.country}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={
                          job.status === "Approved"
                            ? "default"
                            : job.status === "Closed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedJob(job)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => handleDelete(job._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {jobsPagination && (
            <div className="flex items-center justify-end px-4 py-3 border-t">
              <div className="flex gap-4 sm:gap-6 lg:gap-8 items-center">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select value={String(jobsLimit)} onValueChange={(v) => setJobsLimit(Number(v))}>
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-center text-sm font-medium">
                  Page {jobsPagination.page} of {Math.max(1, jobsPagination.totalPages)}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => setJobsPage(1)}
                    disabled={jobsPagination.page <= 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setJobsPage((p) => p - 1)}
                    disabled={jobsPagination.page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setJobsPage((p) => p + 1)}
                    disabled={jobsPagination.page >= jobsPagination.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => setJobsPage(jobsPagination.totalPages)}
                    disabled={jobsPagination.page >= jobsPagination.totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2">
              {selectedJob?.jobTitle}
              <Badge variant="outline" className="text-xs font-normal">
                {selectedJob?.jobType}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {selectedJob?.companyName} • {selectedJob?.city}, {selectedJob?.country}
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">Business</span>
                  <div className="font-medium">
                    {typeof selectedJob.businessId === "object" && selectedJob.businessId?._id ? (
                      <Link
                        to={`/directory/${selectedJob.businessId._id}`}
                        className="text-primary hover:underline"
                      >
                        {getBusinessName(selectedJob)}
                      </Link>
                    ) : (
                      getBusinessName(selectedJob)
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">Company</span>
                  <div className="font-medium">{selectedJob.companyName}</div>
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">Experience</span>
                  <div className="font-medium">{selectedJob.experienceRequired}</div>
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">
                    Salary Range
                  </span>
                  <div className="font-medium">{selectedJob.salaryRange || "Not disclosed"}</div>
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">Contact</span>
                  <div className="font-medium">{selectedJob.email}</div>
                  <div className="text-muted-foreground text-xs">{selectedJob.mobile}</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold block text-muted-foreground mb-2">
                    Job Description
                  </span>
                  <div className="rounded-md border bg-muted p-3 text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedJob.description}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sticky bottom-0 border-t bg-background py-2 gap-2 sm:gap-0">
            {selectedJob && (
              <>
                <Button variant="outline" onClick={() => setApplicantsOpen(true)}>
                  <Users className="w-4 h-4 mr-2" />
                  View Applicants
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedJob._id);
                    setSelectedJob(null);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Job
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedJob && (
        <ApplicantsList
          jobId={selectedJob._id}
          jobTitle={selectedJob.jobTitle}
          open={applicantsOpen}
          onOpenChange={setApplicantsOpen}
        />
      )}
    </div>
  );
}
