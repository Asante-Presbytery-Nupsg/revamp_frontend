// src/hooks/queries/useMembers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getMembers,
  getMemberById,
  approveMember,
  assignShepherd,
  deleteMember,
} from "@/api/members.api";
import type { MemberQuery } from "@/api/members.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useMembers = (query: MemberQuery = {}) =>
  useQuery({
    queryKey: queryKeys.members.all(query),
    queryFn: () => getMembers(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useMembersSearch = (
  search: string,
  { enabled = true, limit = 20 }: { enabled?: boolean; limit?: number } = {},
) =>
  useQuery({
    queryKey: queryKeys.members.all({ search, limit }),
    queryFn: () => getMembers({ search, limit }),
    enabled: enabled && search.length > 0,
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

// ── single member ─────────────────────────────────────────────────────────────
export const useMember = (id: string) =>
  useQuery({
    queryKey: queryKeys.members.detail(id),
    queryFn: () => getMemberById(id),
    enabled: !!id,
  });

// ── mutations ─────────────────────────────────────────────────────────────────
export const useApproveMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveMember(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.members.all() });
      qc.invalidateQueries({ queryKey: queryKeys.members.detail(id) });
      toast.success("Member approved");
    },
    onError: (error: unknown) =>
      error instanceof AxiosError
        ? toast.error(error.message ?? "Failed to approve member")
        : toast.error("Failed to approve member"),
  });
};

export const useAssignShepherd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, shepherdId }: { id: string; shepherdId: string }) =>
      assignShepherd(id, shepherdId),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.members.all() });
      qc.invalidateQueries({ queryKey: queryKeys.members.detail(id) });
      toast.success("Shepherd assigned");
    },
    onError: (error: unknown) =>
      error instanceof AxiosError
        ? toast.error(error.message ?? "Failed to assign shepherd")
        : toast.error("Failed to assign shepherd"),
  });
};

export const useDeleteMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMember(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.members.all() });
      toast.success("Member removed");
    },
    onError: (error: unknown) =>
      error instanceof AxiosError
        ? toast.error(error.message ?? "Failed to remove member")
        : toast.error("Failed to remove member"),
  });
};
