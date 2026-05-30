import { useQuery } from "@tanstack/react-query";
import { getShepherdOverview } from "@/api/shepherdOverview.api";

export const useShepherdOverview = () =>
  useQuery({
    queryKey: ["shepherd", "overview"],
    queryFn: getShepherdOverview,
    staleTime: 1000 * 60,
  });
