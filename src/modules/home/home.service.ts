import api from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/api-endpoints";
import type { Business, HomeStats } from "@/types";

export const homeService = {
  getBusinesses: () =>
    api
      .get<Business[]>(API_ENDPOINTS.BUSINESS_LIST)
      .then((r) => (Array.isArray(r.data) ? r.data : [])),

  getStats: () => api.get<HomeStats>(API_ENDPOINTS.BUSINESS_STATS).then((r) => r.data),
};
