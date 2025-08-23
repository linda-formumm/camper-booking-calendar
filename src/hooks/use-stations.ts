import { useQuery } from "@tanstack/react-query";
import { stationsApi } from "../lib/api";

export function useStations(query?: string) {
  return useQuery({
    queryKey: ["stations", query],
    queryFn: () => stationsApi.getStations(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStation(id: string | undefined) {
  return useQuery({
    queryKey: ["stations", id],
    queryFn: () => (id ? stationsApi.getStation(id) : null),
    enabled: !!id,
  });
}
