// src/store/useAuthStore.ts
import { create } from "zustand";
import BASE_API, { initializeCsrf } from "@/api/base.api";
import type { AuthUser } from "@/types/auth.types";
import { toast } from "sonner";

// Must match your backend JWT_EXPIRES_IN
const ACCESS_TOKEN_LIFETIME_MS = 15 * 60 * 1000;
const REFRESH_BEFORE_MS = 60 * 1000;
const SILENT_REFRESH_DELAY = ACCESS_TOKEN_LIFETIME_MS - REFRESH_BEFORE_MS;

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isChecked: boolean;

  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
  init: () => Promise<void>;
};

// ── Silent Refresh ─────────────────────────────────────────────────────────

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const cancelSilentRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

const scheduleSilentRefresh = () => {
  cancelSilentRefresh();

  refreshTimer = setTimeout(async () => {
    try {
      await BASE_API.post("/auth/refresh");
      // Refresh may set a new CSRF cookie — sync the header
      await initializeCsrf();
      scheduleSilentRefresh();
    } catch {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }
  }, SILENT_REFRESH_DELAY);
};

// ── Store ──────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start true — prevents ProtectedRoute flash
  isChecked: false,

  setUser: (user) => {
    set({ user, isAuthenticated: true, isLoading: false, isChecked: true });
    scheduleSilentRefresh();
  },

  clearAuth: () => {
    cancelSilentRefresh();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  logout: async () => {
    cancelSilentRefresh();
    try {
      await BASE_API.post("/auth/logout");
      toast.success("You have been logged out.");
    } catch {
      // ignore — clearing state regardless
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isChecked: true,
      });
    }
  },

  /**
   * Called once on app mount. Does NOT use cookies to decide if
   * a session exists — just asks the server via /auth/me.
   *
   * The httpOnly accessToken cookie is the real session indicator.
   * We can't read it from JS (by design), so we let the server decide.
   */
  init: async () => {
    if (get().isChecked) return;

    set({ isLoading: true });

    try {
      await initializeCsrf();

      // Ask the server if we have a valid session
      const { data } = await BASE_API.get("/auth/me");
      const user = data.data ?? data;
      set({ user, isAuthenticated: true, isLoading: false, isChecked: true });
      scheduleSilentRefresh();
    } catch {
      // No valid session — clean state, no redirect
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isChecked: true,
      });
    }
  },
}));
