import { ChevronLeft, ChevronRight, ExternalLink, Loader2, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateDDMMMYYYY } from "@/lib/date-utils";
import { type Applicant, jobsService } from "./jobs.service";

interface ApplicantsListProps {
  jobId: string;
  jobTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicantsList({ jobId, jobTitle, open, onOpenChange }: ApplicantsListProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  useEffect(() => {
    if (!open || !jobId) return;
    setLoading(true);
    jobsService
      .getApplicants(jobId, page, limit)
      .then((data) => {
        setApplicants(data.data ?? []);
        setTotal(data.total ?? 0);
        setPage(data.page ?? 1);
        setTotalPages(data.totalPages ?? 0);
      })
      .catch(() => setApplicants([]))
      .finally(() => setLoading(false));
  }, [jobId, open, page]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Applicants – {jobTitle}</DialogTitle>
          <DialogDescription>
            {total} applicant{total !== 1 ? "s" : ""} applied for this job
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : applicants.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No applicants yet</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Applied</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicants.map((a) => (
                    <TableRow key={a._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {a.name}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden mt-1">
                          {a.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <a
                          href={`mailto:${a.email}`}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          {a.email}
                        </a>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <a
                          href={`tel:${a.mobile}`}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {a.mobile}
                        </a>
                      </TableCell>
                      <TableCell>
                        {a.resumeUrl ? (
                          <a
                            href={a.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateDDMMMYYYY(a.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages} ({total} total)
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
      </DialogContent>
    </Dialog>
  );
}
