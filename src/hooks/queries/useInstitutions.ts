import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  getInstitutionsFlat,
} from "@/api/institutions.api";
import type { InstitutionQuery, Institution } from "@/api/institutions.api";
import { toast } from "sonner";

export const useInstitutions = (query: InstitutionQuery = {}) =>
  useQuery({
    queryKey: queryKeys.institutions.all(query),
    queryFn: () => getInstitutions(query),
  });

export const useInstitutionsFlat = (type?: Institution["type"]) =>
  useQuery({
    queryKey: queryKeys.institutions.flat(type ?? "all"),
    queryFn: () => getInstitutionsFlat(type),
    staleTime: 1000 * 60 * 30,
  });

export const useInstitutionsSearch = (search: string, limit = 20) =>
  useQuery({
    queryKey: queryKeys.institutions.all({ search, limit }),
    queryFn: () => getInstitutions({ search, limit }),
    enabled: search.length > 0,
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useInstitution = (id: string) =>
  useQuery({
    queryKey: queryKeys.institutions.detail(id),
    queryFn: () => getInstitutionById(id),
    enabled: !!id,
  });

export const useCreateInstitution = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Institution, "id">) => createInstitution(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institutions"] });
      toast.success("Institution created");
    },
    onError: () => toast.error("Failed to create institution"),
  });
};

export const useUpdateInstitution = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Institution> & { id: string }) =>
      updateInstitution(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["institutions"] });
      qc.invalidateQueries({ queryKey: queryKeys.institutions.detail(id) });
      toast.success("Institution updated");
    },
    onError: () => toast.error("Failed to update institution"),
  });
};

export const useDeleteInstitution = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInstitution(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institutions"] });
      toast.success("Institution deleted");
    },
    onError: () => toast.error("Failed to delete institution"),
  });
};
