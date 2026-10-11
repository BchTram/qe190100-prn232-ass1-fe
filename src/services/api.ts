import axios, { type AxiosError } from "axios";
import { getToken, removeToken } from "@/lib/token";

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
  : "/api";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string; title?: string }>) => {
    const status = error.response?.status;
    const responseMessage = error.response?.data?.message
      ?? error.response?.data?.error
      ?? error.response?.data?.title;

    if (responseMessage) error.message = responseMessage;

    if (typeof window !== "undefined") {
      if (status === 401) {
        removeToken();
        window.localStorage.removeItem("tasktrack.account");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.assign("/login");
        }
      } else if (status === 403 && window.location.pathname !== "/forbidden") {
        window.location.assign("/forbidden");
      } else if (status === 500 && window.location.pathname !== "/error") {
        window.location.assign("/error");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
