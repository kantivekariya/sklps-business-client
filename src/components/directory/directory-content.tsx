"use client";

import { Briefcase, ChevronLeft, ChevronRight, MapPin, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import api, { API_ENDPOINTS } from "@/lib/api";
import type { Business } from "@/types";

interface ListResponse {
  data: Business[];
  total: number;
  page: number;
  totalPages: number;
}

export function DirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "";
  const cityFromUrl = searchParams.get("city") ?? "";
  const pageFromUrl = searchParams.get("page") ?? "1";
  const searchFromUrl = searchParams.get("search") ?? "";

  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [categoryFilter, setCategoryFilter] = useState(categoryFromUrl);
  const [cityFilter, setCityFilter] = useState(cityFromUrl);
  const [currentPage, setCurrentPage] = useState(Math.max(1, parseInt(pageFromUrl, 10) || 1));
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.post<ListResponse>(API_ENDPOINTS.BUSINESS_LIST_POST, {
        page: currentPage,
        limit: 12,
        filters: {
          ...(categoryFilter && { category: categoryFilter }),
          ...(cityFilter && { city: cityFilter }),
          ...(searchTerm.trim() && { search: searchTerm.trim() }),
        },
      });
      setData(res);
    } catch {
      setData({ data: [], total: 0, page: 1, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [currentPage, categoryFilter, cityFilter, searchTerm]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    setSearchTerm(searchFromUrl);
    setCategoryFilter(categoryFromUrl);
    setCityFilter(cityFromUrl);
    setCurrentPage(Math.max(1, parseInt(pageFromUrl, 10) || 1));
  }, [categoryFromUrl, cityFromUrl, pageFromUrl, searchFromUrl]);

  const handleSearch = () => {
    setCurrentPage(1);
    updateUrl(1, categoryFilter, cityFilter, searchTerm);
    fetchBusinesses();
  };

  const updateUrl = (page: number, cat: string, city: string, searchVal: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (cat) params.set("category", cat);
    if (city) params.set("city", city);
    if (searchVal.trim()) params.set("search", searchVal.trim());
    const qs = params.toString();
    router.push(qs ? `/directory?${qs}` : "/directory", { scroll: false });
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
    updateUrl(1, value, cityFilter, searchTerm);
  };

  const handleCityChange = (value: string) => {
    setCityFilter(value);
    setCurrentPage(1);
    updateUrl(1, categoryFilter, value, searchTerm);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(page, categoryFilter, cityFilter, searchTerm);
  };

  const [filterOptions, setFilterOptions] = useState<{ categories: string[]; cities: string[] }>({
    categories: [],
    cities: [],
  });

  useEffect(() => {
    api.get<{ categories: string[]; cities: string[] }>(API_ENDPOINTS.BUSINESS_META_FILTERS).then(
      ({ data }) => setFilterOptions(data)
    ).catch(() => {});
  }, []);

  const businesses = data?.data ?? [];
  const pagination = data
    ? { total: data.total, page: data.page, limit: 12, totalPages: data.totalPages }
    : { total: 0, page: 1, limit: 12, totalPages: 0 };
  const categories = [
    ...new Set([...filterOptions.categories, categoryFilter].filter(Boolean)),
  ].sort();
  const cities = [...new Set([...filterOptions.cities, cityFilter].filter(Boolean))].sort();

  return (
    <>
      <div className="sticky top-20 z-10 mb-10 rounded-xl border bg-card p-6 shadow-md transition-shadow hover:shadow-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="text-muted-foreground" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by name, category, or keyword..."
              className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 transition-colors focus:border-ring focus:ring-2 focus:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="relative md:col-span-3">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Briefcase className="text-muted-foreground" size={18} />
            </div>
            <select
              className="w-full cursor-pointer appearance-none rounded-lg border border-input bg-background py-3 pl-10 pr-4 transition-colors focus:border-ring focus:ring-2 focus:ring-ring"
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="relative md:col-span-3">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MapPin className="text-muted-foreground" size={18} />
            </div>
            <select
              className="w-full cursor-pointer appearance-none rounded-lg border border-input bg-background py-3 pl-10 pr-4 transition-colors focus:border-ring focus:ring-2 focus:ring-ring"
              value={cityFilter}
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : businesses.length > 0 ? (
        <>
          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {businesses.map((business) => (
              <BusinessCard key={business._id} business={business} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft size={20} />
                </Button>
                <span className="min-w-[120px] text-center text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                  <span className="ml-1">({pagination.total} total)</span>
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed bg-card py-20 text-center shadow-sm">
          <p className="text-lg text-muted-foreground">No businesses found matching your criteria.</p>
          <Button
            variant="link"
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("");
              setCityFilter("");
              setCurrentPage(1);
              router.push("/directory");
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </>
  );
}
