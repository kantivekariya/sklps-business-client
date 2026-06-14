import axios, { type AxiosInstance } from "axios";
import { API_URL } from "@/config/env";
import { API_ENDPOINTS } from "./api-endpoints";

const createClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const businessToken = localStorage.getItem("businessToken");
    const adminToken = localStorage.getItem("token");
    const token = businessToken || adminToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

const apiClient = createClient();

export const api = Object.assign(
  {
    get: <T = unknown>(url: string, config?: Parameters<typeof apiClient.get>[1]) =>
      apiClient.get<T>(url, config),
    post: <T = unknown>(
      url: string,
      data?: unknown,
      config?: Parameters<typeof apiClient.post>[2]
    ) => apiClient.post<T>(url, data, config),
    put: <T = unknown>(url: string, data?: unknown, config?: Parameters<typeof apiClient.put>[2]) =>
      apiClient.put<T>(url, data, config),
    patch: <T = unknown>(
      url: string,
      data?: unknown,
      config?: Parameters<typeof apiClient.patch>[2]
    ) => apiClient.patch<T>(url, data, config),
    delete: <T = unknown>(url: string, config?: Parameters<typeof apiClient.delete>[1]) =>
      apiClient.delete<T>(url, config),
  },
  { defaults: apiClient.defaults }
);

export { API_ENDPOINTS };
export default api;
