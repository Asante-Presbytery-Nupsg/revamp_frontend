import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/api/settings.api";
import type {
  OrgSettings,
  NotifSettings,
  AdminProfile,
} from "@/api/settings.api";

const K = {
  profile: ["settings", "profile"] as const,
  org: ["settings", "org"] as const,
  notif: ["settings", "notifications"] as const,
  sessions: ["settings", "sessions"] as const,
  admins: ["settings", "admins"] as const,
  roles: ["settings", "roles"] as const,
};

const inv =
  (qc: ReturnType<typeof useQueryClient>, key: readonly string[]) => () => {
    void qc.invalidateQueries({ queryKey: key });
  };

const onErr = (msg: string) => () => toast.error(msg);

// ── Queries ───────────────────────────────────────────────────────────────────

export const useAdminProfile = () =>
  useQuery({
    queryKey: K.profile,
    queryFn: api.getAdminProfile,
    staleTime: 1000 * 60 * 5,
  });
export const useOrgSettings = () =>
  useQuery({
    queryKey: K.org,
    queryFn: api.getOrgSettings,
    staleTime: 1000 * 60 * 5,
  });
export const useNotifSettings = () =>
  useQuery({
    queryKey: K.notif,
    queryFn: api.getNotifSettings,
    staleTime: 1000 * 60 * 5,
  });
export const useSessions = () =>
  useQuery({
    queryKey: K.sessions,
    queryFn: api.getSessions,
    staleTime: 1000 * 30,
  });
export const useAdmins = () =>
  useQuery({
    queryKey: K.admins,
    queryFn: api.getAdmins,
    staleTime: 1000 * 30,
  });
export const useRoleSummary = () =>
  useQuery({
    queryKey: K.roles,
    queryFn: api.getRoleSummary,
    staleTime: 1000 * 60,
  });

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useUpdateAdminProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      d: Partial<Pick<AdminProfile, "firstName" | "lastName" | "phoneNumber">>,
    ) => api.updateAdminProfile(d),
    onSuccess: (updated) => {
      qc.setQueryData(K.profile, updated);
      toast.success("Profile updated");
    },
    onError: onErr("Failed to update profile"),
  });
};

export const useUpdateOrgSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Partial<OrgSettings>) => api.updateOrgSettings(d),
    onSuccess: (updated) => {
      qc.setQueryData(K.org, updated);
      toast.success("Organisation settings saved");
    },
    onError: onErr("Failed to save organisation settings"),
  });
};

export const useUpdateNotifSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Partial<NotifSettings>) => api.updateNotifSettings(d),
    onSuccess: (updated) => {
      qc.setQueryData(K.notif, updated);
      toast.success("Notification preferences saved");
    },
    onError: onErr("Failed to save notification preferences"),
  });
};

export const useCreateSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createSession,
    onSuccess: () => {
      inv(qc, K.sessions)();
      toast.success("Session created");
    },
    onError: onErr("Failed to create session"),
  });
};

export const useActivateSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.activateSession,
    onSuccess: () => {
      inv(qc, K.sessions)();
      toast.success("Session activated");
    },
    onError: onErr("Failed to activate session"),
  });
};

export const useArchiveAndStart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.archiveAndStart,
    onSuccess: () => {
      inv(qc, K.sessions)();
      toast.success("Session archived and new session started");
    },
    onError: onErr("Failed to archive session"),
  });
};

export const useDeleteSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteSession,
    onSuccess: () => {
      inv(qc, K.sessions)();
      toast.success("Session deleted");
    },
    onError: onErr("Failed to delete session"),
  });
};

export const useRemoveAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.removeAdmin,
    onSuccess: () => {
      inv(qc, K.admins)();
      toast.success("Admin removed");
    },
    onError: onErr("Failed to remove admin"),
  });
};

export const useInviteAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) =>
      api.inviteAdmin(email, role),
    onSuccess: () => {
      inv(qc, K.admins)();
      toast.success("Invite sent successfully");
    },
    onError: onErr("Failed to send invite"),
  });
};

export const useSendPasswordReset = () =>
  useMutation({
    mutationFn: api.sendPasswordReset,
    onSuccess: () => toast.success("Reset link sent — check your email"),
    onError: onErr("Failed to send reset link"),
  });

export const useDeactivateUnassigned = () =>
  useMutation({
    mutationFn: api.deactivateUnassigned,
    onSuccess: (data) =>
      toast.success(
        `${data.affected} member${data.affected !== 1 ? "s" : ""} deactivated`,
      ),
    onError: onErr("Failed to deactivate members"),
  });
