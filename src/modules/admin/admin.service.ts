import api from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/api-endpoints";
import type { Business, Job, PagedResponse } from "@/types";

export interface PagedBusinesses {
  businesses: Business[];
  pagination: { page: number; totalPages: number; total: number };
}

export interface JobStats {
  total: number;
  active: number;
  closed: number;
}

export const adminService = {
  getPendingBusinesses: () =>
    api
      .get<Business[]>(API_ENDPOINTS.ADMIN_PENDING)
      .then((r) => (Array.isArray(r.data) ? r.data : [])),

  getAllBusinesses: () =>
    api
      .get<Business[]>(API_ENDPOINTS.BUSINESS_LIST)
      .then((r) => (Array.isArray(r.data) ? r.data : [])),

  getBusinessesPaged: (page: number, limit: number, search?: string) =>
    api
      .post<PagedBusinesses>(API_ENDPOINTS.ADMIN_BUSINESSES, {
        page,
        limit,
        search: search?.trim() || undefined,
      })
      .then((r) => r.data),

  approveBusiness: (id: string) => api.put(API_ENDPOINTS.BUSINESS_APPROVE(id)).then((r) => r.data),

  deleteBusiness: (id: string) => api.delete(API_ENDPOINTS.BUSINESS_DELETE(id)).then((r) => r.data),

  getJobStats: () => api.get<JobStats>(API_ENDPOINTS.JOB_STATS_SUMMARY).then((r) => r.data),

  getJobsPaged: (page: number, limit: number, filters?: { businessId?: string }) =>
    api
      .post<PagedResponse<Job>>(API_ENDPOINTS.JOB_LIST_POST, {
        page,
        limit,
        filters: filters ?? {},
      })
      .then((r) => r.data),

  deleteJob: (id: string) => api.delete(API_ENDPOINTS.JOB_BY_ID(id)).then((r) => r.data),
};
