import {
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  Globe,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateDDMMMYYYY } from "@/lib/date-utils";
import type { Job } from "@/types";
import { type JobListFilters, jobsService } from "./jobs.service";

const PAGE_SIZE = 6;

const CATEGORIES = [
  "Agriculture", "Art & Design", "Automotive", "Beauty & Care", "Construction",
  "Diamond", "Education", "Event Planning", "Finance", "Food & Beverage",
  "Health", "Hospitality", "IT Services", "Legal Services", "Manufacturing",
  "Marketing", "Media", "Real Estate", "Retail", "Textile", "Trading",
  "Transportation", "Professional", "Other",
];

const COUNTRIES = [
  "Sri Lanka", "India", "UAE", "Saudi Arabia", "Qatar", "Oman", "Kenya", "Other",
];

function JobCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 w-20 bg-muted rounded-full" />
        <div className="h-4 w-16 bg-muted rounded" />
      </div>
      <div className="h-5 w-3/4 bg-muted rounded" />
      <div className="h-4 w-1/2 bg-muted rounded" />
      <div className="space-y-2 mt-2">
        <div className="h-3.5 w-2/3 bg-muted rounded" />
        <div className="h-3.5 w-1/2 bg-muted rounded" />
        <div className="h-3.5 w-3/5 bg-muted rounded" />
      </div>
      <div className="h-9 w-full bg-muted rounded-xl mt-2" />
    </div>
  );
}

export function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filters: JobListFilters = {
    ...(search && { search }),
    ...(category && { category }),
    ...(country && { country }),
  };

  const fetchInitial = useCallback(async (f: JobListFilters) => {
    setLoading(true);
    setPage(1);
    try {
      const res = await jobsService.list(1, PAGE_SIZE, f);
      setJobs(res.data);
      setTotal(res.total);
    } catch {
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search input → update `search` state
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(searchInput), 420);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  // Re-fetch when any filter changes
  useEffect(() => {
    fetchInitial({ ...(search && { search }), ...(category && { category }), ...(country && { country }) });
  }, [search, category, country, fetchInitial]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await jobsService.list(nextPage, PAGE_SIZE, filters);
      setJobs((prev) => [...prev, ...res.data]);
      setPage(nextPage);
    } catch {
      // swallow
    } finally {
      setLoadingMore(false);
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setCountry("");
  };

  const hasMore = jobs.length < total;
  const hasActiveFilters = !!(searchInput || category || country);

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="rounded-2xl border bg-white shadow-lg mb-8 overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search job title or company…"
                className="w-full rounded-xl border border-input bg-muted/30 py-2.5 pl-10 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(""); setSearch(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category */}
            <div className="sm:w-48">
              <Select value={category || "__all__"} onValueChange={(v) => setCategory(v === "__all__" ? "" : v)}>
                <SelectTrigger className="rounded-xl bg-muted/30 border-input h-[42px] text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Categories</SelectItem>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="sm:w-40">
              <Select value={country || "__all__"} onValueChange={(v) => setCountry(v === "__all__" ? "" : v)}>
                <SelectTrigger className="rounded-xl bg-muted/30 border-input h-[42px] text-sm">
                  <Globe className="mr-1.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Countries</SelectItem>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Result count + active filters */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-muted/30 border-t border-border/40">
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {!loading && (
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{total}</span> job{total !== 1 ? "s" : ""} found
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2.5 py-0.5">
                {category}
                <button type="button" onClick={() => setCategory("")}><X className="h-2.5 w-2.5" /></button>
              </span>
            )}
            {country && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2.5 py-0.5">
                {country}
                <button type="button" onClick={() => setCountry("")}><X className="h-2.5 w-2.5" /></button>
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="group flex flex-col bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Top colour strip */}
                <div className="h-1 w-full bg-primary shrink-0" />

                <div className="flex flex-col flex-1 p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant="outline" className="text-[10px] font-semibold shrink-0">
                      {job.category}
                    </Badge>
                    {job.createdAt && (
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatDateDDMMMYYYY(job.createdAt)}
                      </span>
                    )}
                  </div>

                  {/* Title + company */}
                  <h3 className="text-[15px] font-bold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors">
                    {job.jobTitle}
                  </h3>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    {job.companyName}
                  </p>

                  {/* Meta */}
                  <div className="space-y-2 text-xs text-muted-foreground flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                      {job.city}, {job.country}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                      {job.jobType}
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                      {job.experienceRequired}
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span className="font-semibold text-emerald-600">{job.salaryRange}</span>
                      </div>
                    )}
                  </div>

                  {/* Benefit badges */}
                  {(job.accommodation || job.visaSupport) && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.accommodation && (
                        <Badge variant="secondary" className="text-[10px]">Accommodation</Badge>
                      )}
                      {job.visaSupport && (
                        <Badge variant="secondary" className="text-[10px]">Visa Support</Badge>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <Link to={`/jobs/${job._id}`}>
                      <Button className="w-full rounded-xl h-9 text-sm font-semibold">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Load more ── */}
          {hasMore && (
            <div className="mt-10 flex flex-col items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded-full px-10 font-semibold"
              >
                {loadingMore ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</>
                ) : (
                  `Load More Jobs (${total - jobs.length} remaining)`
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Showing {jobs.length} of {total} jobs
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold text-foreground mb-1">No jobs found</p>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={clearFilters} className="rounded-full px-6">
            Clear all filters
          </Button>
        </div>
      )}
    </>
  );
}
