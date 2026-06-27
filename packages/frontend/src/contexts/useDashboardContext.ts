import { useDashboardActions } from "./useDashboardActions";
import { useDashboardConnection } from "./useDashboardConnection";
import { useDashboardDataState } from "./useDashboardDataState";
import type {
  DashboardActionsContextValue,
  DashboardConnectionContextValue,
  DashboardDataStateContextValue,
} from "./dashboardDataTypes";

type DashboardContextValue = DashboardDataStateContextValue &
  DashboardConnectionContextValue &
  DashboardActionsContextValue;

export const useDashboardContext = (): DashboardContextValue => {
  const dataState = useDashboardDataState();
  const connection = useDashboardConnection();
  const actions = useDashboardActions();

  return {
    ...dataState,
    ...connection,
    ...actions,
  };
};
