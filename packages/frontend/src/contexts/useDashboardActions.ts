import { useContext } from "react";
import { DashboardActionsContext } from "./dashboardDataTypes";
import type { DashboardActionsContextValue } from "./dashboardDataTypes";

export const useDashboardActions = (): DashboardActionsContextValue => {
  const ctx = useContext(DashboardActionsContext);

  if (ctx === null) {
    throw new Error(
      "useDashboardActions must be used within DashboardDataProvider",
    );
  }

  return ctx;
};
