import { useQuery, useQueryClient } from "@tanstack/react-query";
import { stationsApi } from "../lib/api";
import { queryKeys } from "../lib/query-keys";

/**
 * Hook to fetch stations with optional search query
 */
export function useStations(query?: string) {
  return useQuery({
    queryKey: queryKeys.stations.list(query),
    queryFn: () => stationsApi.getStations(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a single station by ID
 */
export function useStation(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.stations.detail(id || ""),
    queryFn: () => (id ? stationsApi.getStation(id) : null),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Utility to prefetch a station
 */
export function usePrefetchStation() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.stations.detail(id),
      queryFn: () => stationsApi.getStation(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Utility to prefetch all stations
 */
export function usePrefetchStations() {
  const queryClient = useQueryClient();

  return (query?: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.stations.list(query),
      queryFn: () => stationsApi.getStations(query),
      staleTime: 5 * 60 * 1000,
    });
  };
}
