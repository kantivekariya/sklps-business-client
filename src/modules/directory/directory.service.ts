import api from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/api-endpoints";
import type { Business, PagedResponse } from "@/types";

export interface DirectoryFilters {
  category?: string;
  city?: string;
  search?: string;
}

export interface DirectoryMeta {
  categories: string[];
  cities: string[];
}

export const directoryService = {
  getBusinesses: (page: number, limit: number, filters: DirectoryFilters) =>
    api
      .post<PagedResponse<Business>>(API_ENDPOINTS.BUSINESS_LIST_POST, { page, limit, filters })
      .then((r) => r.data),

  getMetaFilters: () =>
    api.get<DirectoryMeta>(API_ENDPOINTS.BUSINESS_META_FILTERS).then((r) => r.data),
};
