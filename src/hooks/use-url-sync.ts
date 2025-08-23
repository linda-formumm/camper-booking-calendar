import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useUrlSync } from "../store/appStore";

// Hook for syncing app state with URL search parameters
export function useUrlStateSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getStateForUrl, setStateFromUrl } = useUrlSync();

  // Sync URL to state on mount and URL changes
  useEffect(() => {
    const station = searchParams.get("station");
    const week = searchParams.get("week");

    if (station || week) {
      setStateFromUrl({
        station: station || undefined,
        week: week || undefined,
      });
    }
  }, [searchParams, setStateFromUrl]);

  // Function to update URL with current state
  const syncStateToUrl = () => {
    const state = getStateForUrl();
    const newParams = new URLSearchParams();

    if (state.station) {
      newParams.set("station", state.station);
    }

    if (state.week) {
      newParams.set("week", state.week);
    }

    setSearchParams(newParams, { replace: true });
  };

  return {
    syncStateToUrl,
  };
}

// Hook for manually updating specific URL params
export function useUpdateUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams, { replace: true });
  };

  return {
    updateParams,
    getParam: (key: string) => searchParams.get(key),
    hasParam: (key: string) => searchParams.has(key),
  };
}
