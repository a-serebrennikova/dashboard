import { useContext } from "react";
import { DashboardConnectionContext, type DashboardConnectionContextValue } from "../dashboardDataTypes";

export const useDashboardConnection = (): DashboardConnectionContextValue => {
  const ctx = useContext(DashboardConnectionContext);

  if (ctx === null) {
    throw new Error(
      "useDashboardConnection must be used within DashboardDataProvider",
    );
  }

  return ctx;
};
