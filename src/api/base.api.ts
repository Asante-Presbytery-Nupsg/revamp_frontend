// src/api/base.api.ts
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const BASE_API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ── CSRF ───────────────────────────────────────────────────────────────────

const readCsrfCookie = (): string | undefined =>
  document.cookie
    .split("; ")
    .find((c) => c.startsWith("csrfToken="))
    ?.split("=")[1];

export const initializeCsrf = async (): Promise<void> => {
  // 1. Try reading from cookie first (fastest path)
  const existing = readCsrfCookie();
  if (existing) {
    BASE_API.defaults.headers.common["X-CSRF-Token"] = existing;
    return;
  }

  try {
    const { data } = await BASE_API.get("/auth/csrf-token");
    const token = data?.csrfToken ?? data?.token;
    if (token) {
      BASE_API.defaults.headers.common["X-CSRF-Token"] = token;
    }
  } catch {
    // Not authenticated — no CSRF needed for public routes
  }
};

// ── Request Interceptor ────────────────────────────────────────────────────

BASE_API.interceptors.request.use((config) => {
  const csrf = readCsrfCookie();
  if (csrf) {
    config.headers["X-CSRF-Token"] = csrf;
  }

  // Strip empty/null/undefined query params
  if (config.params) {
    config.params = Object.fromEntries(
      Object.entries(config.params).filter(
        ([, v]) => v !== "" && v !== undefined && v !== null,
      ),
    );
  }

  return config;
});

// ── Response Interceptor ───────────────────────────────────────────────────

BASE_API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/me") ||
      url.includes("/auth/refresh") ||
      url.includes("/csrf-token");

    // Normalise error message from server response
    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    error.message = serverMessage;

    if (status === 429) {
      error.message =
        error.response?.data?.error ??
        "Too many requests. Please slow down and try again.";
    }

    // CSRF token expired/missing — try to refresh it and retry once
    if (status === 403 && !isAuthEndpoint && !error.config?._csrfRetried) {
      const body = error.response?.data;
      const isCsrfError =
        typeof body?.message === "string" &&
        body.message.toLowerCase().includes("csrf");

      if (isCsrfError) {
        error.config._csrfRetried = true;
        await initializeCsrf();
        const csrf = readCsrfCookie();
        if (csrf) {
          error.config.headers["X-CSRF-Token"] = csrf;
        }
        return BASE_API.request(error.config);
      }
    }

    // 401 on a non-auth endpoint — session expired
    if (status === 401 && !isAuthEndpoint) {
      const store = useAuthStore.getState();
      if (store.isAuthenticated) {
        store.clearAuth();
      }
    }

    return Promise.reject(error);
  },
);

export default BASE_API;
