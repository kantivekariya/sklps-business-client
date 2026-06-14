import api from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/api-endpoints";
import type { Job } from "@/types";

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
}

export const businessDashboardService = {
  getStats: () =>
    api.get<DashboardStats>(API_ENDPOINTS.BUSINESS_DASHBOARD_STATS).then((r) => r.data),

  getMyJobs: () =>
    api
      .get<Job[]>(API_ENDPOINTS.JOB_BUSINESS_MINE)
      .then((r) => (Array.isArray(r.data) ? r.data : [])),

  getJobById: (id: string) => api.get<Job>(API_ENDPOINTS.JOB_BY_ID(id)).then((r) => r.data),

  createJob: (data: unknown) => api.post(API_ENDPOINTS.JOB_CREATE, data).then((r) => r.data),
};
