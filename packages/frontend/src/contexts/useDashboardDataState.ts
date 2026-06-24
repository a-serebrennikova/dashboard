import { useContext } from "react";
import { DashboardDataStateContext } from "./dashboardDataTypes";
import type { DashboardDataStateContextValue } from "./dashboardDataTypes";

export const useDashboardDataState = (): DashboardDataStateContextValue => {
  const ctx = useContext(DashboardDataStateContext);

  if (ctx === null) {
    throw new Error(
      "useDashboardDataState must be used within DashboardDataProvider",
    );
  }

  return ctx;
};
