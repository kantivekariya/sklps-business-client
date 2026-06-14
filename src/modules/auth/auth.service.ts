import api from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/api-endpoints";
import type { Admin, Business } from "@/types";

interface ServerAdminResponse {
  _id: string;
  name: string;
  email: string;
  role?: string;
  token?: string;
}

interface ServerBusinessResponse {
  _id: string;
  email: string;
  businessName: string;
  name: string;
  category?: string;
  city?: string;
  description?: string;
  mobile?: string;
  address?: string;
  status?: string;
  token?: string;
}

const toAdmin = (r: ServerAdminResponse): Admin => ({
  _id: r._id,
  name: r.name,
  email: r.email,
  role: r.role ?? "admin",
});

const toBusiness = (r: ServerBusinessResponse): Business => ({
  _id: r._id,
  email: r.email,
  businessName: r.businessName,
  name: r.name,
  category: r.category ?? "",
  city: r.city ?? "",
  description: r.description ?? "",
  mobile: r.mobile ?? "",
  address: r.address ?? "",
  status: r.status,
});

export const authService = {
  adminLogin: (email: string, password: string) =>
    api
      .post<ServerAdminResponse>(API_ENDPOINTS.AUTH_LOGIN, { email, password })
      .then((r) => ({ token: r.data.token ?? "", admin: toAdmin(r.data) })),

  getAdminMe: () =>
    api.get<ServerAdminResponse>(API_ENDPOINTS.AUTH_ME).then((r) => ({ admin: toAdmin(r.data) })),

  businessLogin: (email: string, password: string) =>
    api
      .post<ServerBusinessResponse>(API_ENDPOINTS.BUSINESS_LOGIN, { email, password })
      .then((r) => ({ token: r.data.token ?? "", business: toBusiness(r.data) })),

  getBusinessMe: () =>
    api
      .get<ServerBusinessResponse>(API_ENDPOINTS.BUSINESS_ME)
      .then((r) => ({ business: toBusiness(r.data) })),
};
