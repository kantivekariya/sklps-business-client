import api from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/api-endpoints";
import type { Job, PagedResponse } from "@/types";

export interface Applicant {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  resumeUrl?: string;
  createdAt: string;
  status?: string;
}

export interface JobApplication {
  name: string;
  email: string;
  mobile: string;
  location: string;
  experience: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface JobListFilters {
  search?: string;
  category?: string;
  country?: string;
}

export const jobsService = {
  list: (page: number, limit: number, filters: JobListFilters = {}) =>
    api
      .post<PagedResponse<Job>>(API_ENDPOINTS.JOB_LIST_POST, { page, limit, filters })
      .then((r) => r.data),

  getById: (id: string) => api.get<Job>(API_ENDPOINTS.JOB_BY_ID(id)).then((r) => r.data),

  apply: (jobId: string, data: JobApplication) =>
    api.post(API_ENDPOINTS.JOB_APPLY(jobId), data).then((r) => r.data),

  getApplicants: (jobId: string, page: number, limit: number) =>
    api
      .post<PagedResponse<Applicant>>(API_ENDPOINTS.JOB_APPLICANTS_LIST, { jobId, page, limit })
      .then((r) => r.data),
};
