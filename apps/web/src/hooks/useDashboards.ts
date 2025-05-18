import { useQuery } from "@tanstack/react-query";
import { dashboardsService } from "../api/services/dashboards";
import type { Dashboard } from "../api/services/dashboards";

export function useDashboards() {
  return useQuery<Dashboard[]>({
    queryKey: ["dashboards"],
    queryFn: () => dashboardsService.get(),
  });
}
