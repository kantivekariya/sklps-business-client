import { LayoutGrid, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessCard } from "@/modules/business/business-card";
import type { Business } from "@/types";
import { directoryService } from "./directory.service";

const PAGE_SIZE = 6;

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-hidden animate-pulse">
      <div className="bg-muted" style={{ aspectRatio: "16/9" }} />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
        <div className="h-8 bg-muted rounded mt-4" />
      </div>
    </div>
  );
}

export function DirectoryContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") ?? "";
  const cityFromUrl = searchParams.get("city") ?? "";
  const searchFromUrl = searchParams.get("search") ?? "";

  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromUrl);
  const [categoryFilter, setCategoryFilter] = useState(categoryFromUrl);
  const [cityFilter, setCityFilter] = useState(cityFromUrl);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{ categories: string[]; cities: string[] }>({
    categories: [],
    cities: [],
  });

  const buildFilters = useCallback(() => ({
    ...(categoryFilter && { category: categoryFilter }),
    ...(cityFilter && { city: cityFilter }),
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
  }), [categoryFilter, cityFilter, debouncedSearch]);

  // Initial / filter-change fetch — resets list
  const fetchInitial = useCallback(async () => {
    setLoading(true);
    setPage(1);
    try {
      const data = await directoryService.getBusinesses(1, PAGE_SIZE, buildFilters());
      setBusinesses(data.data);
      setTotal(data.total);
    } catch {
      setBusinesses([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [buildFilters]);

  useEffect(() => { fetchInitial(); }, [fetchInitial]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 420);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Sync URL params on first load
  useEffect(() => {
    setSearchTerm(searchFromUrl);
    setDebouncedSearch(searchFromUrl);
    setCategoryFilter(categoryFromUrl);
    setCityFilter(cityFromUrl);
  }, [categoryFromUrl, cityFromUrl, searchFromUrl]);

  useEffect(() => {
    directoryService.getMetaFilters().then(setFilterOptions).catch(() => {});
  }, []);

  const updateUrl = (category: string, city: string, search: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (search.trim()) params.set("search", search.trim());
    navigate(params.toString() ? `/directory?${params}` : "/directory");
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    updateUrl(value, cityFilter, searchTerm);
  };

  const handleCityChange = (value: string) => {
    setCityFilter(value);
    updateUrl(categoryFilter, value, searchTerm);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const data = await directoryService.getBusinesses(nextPage, PAGE_SIZE, buildFilters());
      setBusinesses((prev) => [...prev, ...data.data]);
      setPage(nextPage);
    } catch {
      // swallow
    } finally {
      setLoadingMore(false);
    }
  };

  const clearAll = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setCityFilter("");
    navigate("/directory");
  };

  const categories = [...new Set([...filterOptions.categories, categoryFilter].filter(Boolean))].sort();
  const cities = [...new Set([...filterOptions.cities, cityFilter].filter(Boolean))].sort();
  const hasActiveFilters = !!(searchTerm || categoryFilter || cityFilter);
  const hasMore = businesses.length < total;

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
                placeholder="Search businesses, categories, or keywords…"
                className="w-full rounded-xl border border-input bg-muted/30 py-2.5 pl-10 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && updateUrl(categoryFilter, cityFilter, searchTerm)}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => { setSearchTerm(""); updateUrl(categoryFilter, cityFilter, ""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category */}
            <div className="sm:w-48">
              <Select value={categoryFilter || "__all__"} onValueChange={(v) => handleCategoryChange(v === "__all__" ? "" : v)}>
                <SelectTrigger className="rounded-xl bg-muted/30 border-input h-[42px] text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="sm:w-40">
              <Select value={cityFilter || "__all__"} onValueChange={(v) => handleCityChange(v === "__all__" ? "" : v)}>
                <SelectTrigger className="rounded-xl bg-muted/30 border-input h-[42px] text-sm">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active filters + result count bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-muted/30 border-t border-border/40">
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {!loading && (
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{total}</span> business{total !== 1 ? "es" : ""} found
              </span>
            )}
            {categoryFilter && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2.5 py-0.5">
                {categoryFilter}
                <button type="button" onClick={() => handleCategoryChange("")} className="hover:text-primary/70">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
            {cityFilter && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2.5 py-0.5">
                {cityFilter}
                <button type="button" onClick={() => handleCityChange("")} className="hover:text-primary/70">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : businesses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {businesses.map((business, i) => (
              <BusinessCard key={business._id} business={business} index={i} />
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
                  `Load More Businesses (${total - businesses.length} remaining)`
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Showing {businesses.length} of {total} businesses
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <LayoutGrid className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold text-foreground mb-1">No businesses found</p>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={clearAll} className="rounded-full px-6">
            Clear all filters
          </Button>
        </div>
      )}
    </>
  );
}
