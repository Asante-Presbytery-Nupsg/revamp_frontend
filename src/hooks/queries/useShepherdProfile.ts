import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyShepherdProfile,
  updateMyShepherdProfile,
  type UpdateShepherdProfileInput,
} from "@/api/shepherd.api";
import { queryKeys } from "@/lib/queryKeys";

export const useShepherdProfile = () =>
  useQuery({
    queryKey: queryKeys.shepherds.myProfile(),
    queryFn: getMyShepherdProfile,
    staleTime: 1000 * 60 * 5,
  });

export const useUpdateShepherdProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateShepherdProfileInput) =>
      updateMyShepherdProfile(input),
    onSuccess: (updated) => {
      // Write response directly into cache — no refetch needed
      qc.setQueryData(queryKeys.shepherds.myProfile(), updated);
    },
  });
};
