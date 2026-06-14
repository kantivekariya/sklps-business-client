import api from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/api-endpoints";
import type { Business } from "@/types";

export const businessService = {
  getById: (id: string) => api.get<Business>(API_ENDPOINTS.BUSINESS_BY_ID(id)).then((r) => r.data),

  getAll: () =>
    api
      .get<Business[]>(API_ENDPOINTS.BUSINESS_LIST)
      .then((r) => (Array.isArray(r.data) ? r.data : [])),

  create: (formData: FormData) =>
    api
      .post<Business>(API_ENDPOINTS.BUSINESS_CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
};
