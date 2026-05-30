import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  createPresbytery,
  updatePresbytery,
  deletePresbytery,
  getRegionsFlat,
  getPresbyteriesByRegion,
} from "@/api/regions.api";
import { toast } from "sonner";

export const useRegionsFlat = () =>
  useQuery({
    queryKey: queryKeys.regions.all({ flat: true }),
    queryFn: () => getRegionsFlat(),
    staleTime: 1000 * 60 * 30,
  });

export const useRegionsSearch = (search: string, limit = 20) =>
  useQuery({
    queryKey: queryKeys.regions.all({ search, limit }),
    queryFn: () => getRegions({ search, limit }),
    enabled: search.length > 0,
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const usePresbyteriesByRegion = (regionId: string) =>
  useQuery({
    queryKey: queryKeys.regions.presbyteries(regionId),
    queryFn: () => getPresbyteriesByRegion(regionId),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 10,
  });

export const useRegion = (id: string) =>
  useQuery({
    queryKey: queryKeys.regions.detail(id),
    queryFn: () => getRegionById(id),
    enabled: !!id,
  });

export const useCreateRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createRegion(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.regions.all() });
      qc.invalidateQueries({ queryKey: ["regions"] });
      toast.success("Region created");
    },
    onError: () => toast.error("Failed to create region"),
  });
};

export const useUpdateRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateRegion(id, name),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.regions.all() });
      qc.invalidateQueries({ queryKey: queryKeys.regions.detail(id) });
      qc.invalidateQueries({ queryKey: ["regions"] });
      toast.success("Region updated");
    },
    onError: () => toast.error("Failed to update region"),
  });
};

export const useDeleteRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRegion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.regions.all() });
      qc.invalidateQueries({ queryKey: ["regions"] });
      toast.success("Region deleted");
    },
    onError: () => toast.error("Failed to delete region"),
  });
};

export const useCreatePresbytery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ regionId, name }: { regionId: string; name: string }) =>
      createPresbytery(regionId, name),
    onSuccess: (_data, { regionId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.regions.all() });
      qc.invalidateQueries({ queryKey: ["regions"] });
      qc.invalidateQueries({ queryKey: queryKeys.regions.detail(regionId) });
      qc.invalidateQueries({
        queryKey: queryKeys.regions.presbyteries(regionId),
      });
      toast.success("Presbytery added");
    },
    onError: () => toast.error("Failed to add presbytery"),
  });
};

export const useUpdatePresbytery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updatePresbytery(id, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.regions.all() });
      toast.success("Presbytery updated");
    },
    onError: () => toast.error("Failed to update presbytery"),
  });
};

export const useDeletePresbytery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePresbytery(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.regions.all() });
      toast.success("Presbytery deleted");
    },
    onError: () => toast.error("Failed to delete presbytery"),
  });
};
