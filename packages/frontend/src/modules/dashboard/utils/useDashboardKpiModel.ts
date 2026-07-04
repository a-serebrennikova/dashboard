import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import { countActiveIncidents } from "./countActiveIncidents";
import { toDashboardTimestamp } from "../../../utils/formatDashboardTime";

export type KpiSnapshot = {
  activeServices: number;
  openIncidents: number;
};

export type DashboardKpiModel = {
  activeServicesCount: number;
  openCount: number;
  criticalCount: number;
  warningCount: number;
  otherCount: number;
  generatedAt: string;
  lastUpdatedAt: string;
  previousKpi: KpiSnapshot | null;
};

const EMPTY_MODEL: DashboardKpiModel = {
  activeServicesCount: 0,
  openCount: 0,
  criticalCount: 0,
  warningCount: 0,
  otherCount: 0,
  generatedAt: "",
  lastUpdatedAt: "",
  previousKpi: null,
};

export const useDashboardKpiModel = (
  data: DashboardPayload | null,
): DashboardKpiModel => {
  const [previousKpi, setPreviousKpi] = useState<KpiSnapshot | null>(null);
  const lastKpiRef = useRef<KpiSnapshot | null>(null);
  const lastGeneratedAtRef = useRef<string | null>(null);

  const activeServicesCount = useMemo(() => {
    if (!data) {
      return 0;
    }

    return data.services.filter((service) => service.isActive).length;
  }, [data]);

  const incidentCounts = useMemo(
    () => (data ? countActiveIncidents(data.incidents) : null),
    [data],
  );

  const openCount = incidentCounts?.openCount ?? 0;
  const criticalCount = incidentCounts?.criticalCount ?? 0;
  const warningCount = incidentCounts?.warningCount ?? 0;
  const otherCount = incidentCounts?.otherCount ?? 0;
  const generatedAt = data?.generatedAt ?? "";
  const lastUpdatedAt = useMemo(() => {
    if (!data || data.incidents.length === 0) {
      return generatedAt;
    }

    return data.incidents.reduce((latest, incident) => {
      return (toDashboardTimestamp(incident.updatedAt) ??
        Number.NEGATIVE_INFINITY) >
        (toDashboardTimestamp(latest) ?? Number.NEGATIVE_INFINITY)
        ? incident.updatedAt
        : latest;
    }, data.incidents[0]?.updatedAt ?? generatedAt);
  }, [data, generatedAt]);

  useLayoutEffect(() => {
    if (!data) {
      return;
    }

    if (lastGeneratedAtRef.current === generatedAt) {
      return;
    }

    const currentKpi: KpiSnapshot = {
      activeServices: activeServicesCount,
      openIncidents: openCount,
    };

    setPreviousKpi(lastKpiRef.current);
    lastKpiRef.current = currentKpi;
    lastGeneratedAtRef.current = generatedAt;
  }, [data, activeServicesCount, generatedAt, openCount]);

  if (!data) {
    return EMPTY_MODEL;
  }

  return {
    activeServicesCount,
    openCount,
    criticalCount,
    warningCount,
    otherCount,
    generatedAt,
    lastUpdatedAt,
    previousKpi,
  };
};
