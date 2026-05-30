// src/hooks/queries/useSheepProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile } from "@/api/sheepProfile.api";
import type { UpdateSheepProfileInput } from "@/api/sheepProfile.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

const SP_KEY = "sheep-profile";

const extractError = (error: unknown, fallback: string) =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message ?? fallback)
    : fallback;

export const useMyProfile = () =>
  useQuery({
    queryKey: [SP_KEY, "me"],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5,
  });

export const useUpdateMyProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSheepProfileInput) => updateMyProfile(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SP_KEY] });
      toast.success("Profile updated");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to update profile")),
  });
};
