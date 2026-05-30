import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getProgrammes, getProgrammesFlat } from "@/api/programmes.api";
import type { ProgrammeQuery } from "@/api/programmes.api";

export const useProgrammes = (query: ProgrammeQuery = {}) =>
  useQuery({
    queryKey: queryKeys.programmes.all(query),
    queryFn: () => getProgrammes(query),
  });

export const useProgrammesFlat = () =>
  useQuery({
    queryKey: queryKeys.programmes.flat,
    queryFn: () => getProgrammesFlat(),
    staleTime: 1000 * 60 * 30,
  });
export const useProgrammesSearch = (search: string, limit = 20) =>
  useQuery({
    queryKey: queryKeys.programmes.all({ search, limit }),
    queryFn: () => getProgrammes({ search, limit }),
    enabled: true,
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });
