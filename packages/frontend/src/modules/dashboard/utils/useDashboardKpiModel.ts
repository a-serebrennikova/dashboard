import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";

export type KpiSnapshot = {
  activeServices: number;
  openIncidents: number;
};

export type DashboardKpiModel = {
  activeServicesCount: number;
  openCount: number;
  criticalCount: number;
  avgResponseTime: number;
  generatedAt: string;
  lastUpdatedAt: string;
  previousKpi: KpiSnapshot | null;
};

const EMPTY_MODEL: DashboardKpiModel = {
  activeServicesCount: 0,
  openCount: 0,
  criticalCount: 0,
  avgResponseTime: 0,
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

  const openCount = data?.snapshot.openCount ?? 0;
  const criticalCount = data?.snapshot.criticalCount ?? 0;
  const avgResponseTime = data?.snapshot.avgResponseTime ?? 0;
  const generatedAt = data?.generatedAt ?? "";
  const lastUpdatedAt = data?.snapshot.lastUpdatedAt ?? "";

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
    avgResponseTime,
    generatedAt,
    lastUpdatedAt,
    previousKpi,
  };
};
