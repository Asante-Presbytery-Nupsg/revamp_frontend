import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getInvites,
  getInviteById,
  getInviteByToken,
  sendInvite,
  acceptInvite,
  revokeInvite,
  resendInvite,
  deleteInvite,
} from "@/api/invites.api";
import type { InviteQuery } from "@/api/invites.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

const extractError = (error: unknown, fallback: string) =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message ?? fallback)
    : fallback;

// ── queries ───────────────────────────────────────────────────────────────────

export const useInvites = (query: InviteQuery = {}) =>
  useQuery({
    queryKey: queryKeys.invites.all(query),
    queryFn: () => getInvites(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useInvite = (id: string) =>
  useQuery({
    queryKey: queryKeys.invites.detail(id),
    queryFn: () => getInviteById(id),
    enabled: !!id,
  });

export const useInviteByToken = (token: string) =>
  useQuery({
    queryKey: queryKeys.invites.byToken(token),
    queryFn: () => getInviteByToken(token),
    enabled: !!token,
  });

// ── mutations ─────────────────────────────────────────────────────────────────

export const useSendInvite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => sendInvite(email),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.invites.all() });
      toast.success("Invite sent");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to send invite")),
  });
};

export const useAcceptInvite = () =>
  useMutation({
    mutationFn: (token: string) => acceptInvite(token),
    onError: (error) =>
      toast.error(extractError(error, "Failed to accept invite")),
  });

export const useRevokeInvite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokeInvite(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.invites.all() });
      qc.invalidateQueries({ queryKey: queryKeys.invites.detail(id) });
      toast.success("Invite revoked");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to revoke invite")),
  });
};

export const useResendInvite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resendInvite(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.invites.all() });
      toast.success("Invite resent");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to resend invite")),
  });
};

export const useDeleteInvite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvite(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.invites.all() });
      toast.success("Invite deleted");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to delete invite")),
  });
};
