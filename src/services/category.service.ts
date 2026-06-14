import api from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/api-endpoints";
import type { Category } from "@/types";

export const categoryService = {
  getCategories: () =>
    api.get<Category[]>(API_ENDPOINTS.CATEGORIES).then((r) => (Array.isArray(r.data) ? r.data : [])),
};
