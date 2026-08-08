import { useCallback, useEffect, useState } from "react";
import type {
  ConnectionStatus,
  IncidentsTrendPoint,
  LastErrorReason,
} from "../../shared/types/dashboard.ts";
import {
  type CreateIncidentInput,
  type Service,
} from "@package/dashboard-shared/dashboard";
import { useDashboardSocketTransport } from "./useDashboardSocketTransport.ts";
import { useIncidentsTrend } from "./useIncidentsTrend.ts";
import { resolveHttpBaseUrl } from "../../shared/utils/resolveHttpBaseUrl.ts";
import {
  createIncident as createIncidentRequest,
  fetchServices,
} from "../../services/dashboardApi.ts";

const envWsUrl = import.meta.env.VITE_WS_URL?.trim();
const envWsUrlDev = import.meta.env.VITE_WS_URL_DEV?.trim();
const DEFAULT_WS_URL = import.meta.env.DEV
  ? (envWsUrlDev ?? envWsUrl)
  : envWsUrl;

type UseDashboardDataResult = {
  connectionStatus: ConnectionStatus;
  data: ReturnType<typeof useDashboardSocketTransport>["data"];
  incidentsTrend: IncidentsTrendPoint[];
  hasTrendHistoryLoaded: boolean;
  isLoadingData: boolean;
  isInitialDataTimedOut: boolean;
  lastErrorReason: LastErrorReason;
  isRetryCooldown: boolean;
  isCreateIncidentSubmitting: boolean;
  services: Service[];
  createIncident: (input: CreateIncidentInput) => Promise<void>;
  retryNow: () => void;
};

export const useDashboardData = (
  url = DEFAULT_WS_URL,
): UseDashboardDataResult => {
  const {
    connectionStatus,
    data,
    isInitialDataTimedOut,
    lastErrorReason,
    isRetryCooldown,
    retryNow,
  } = useDashboardSocketTransport(url ?? "");
  const [services, setServices] = useState<Service[]>([]);
  const [isCreateIncidentSubmitting, setIsCreateIncidentSubmitting] =
    useState(false);
  const baseUrl = resolveHttpBaseUrl(url ?? window.location.origin);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    const loadServices = async () => {
      try {
        const parsedServices = await fetchServices(baseUrl, controller.signal);

        if (!isCancelled) {
          setServices(parsedServices);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to load services", error);
      }
    };

    loadServices();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [baseUrl]);

  const createIncident = useCallback(
    async (input: CreateIncidentInput) => {
      setIsCreateIncidentSubmitting(true);

      try {
        await createIncidentRequest(baseUrl, input);
      } finally {
        setIsCreateIncidentSubmitting(false);
      }
    },
    [baseUrl],
  );

  const incidentsTrend = useIncidentsTrend(data, data?.trendHistory);
  const hasTrendHistoryLoaded = (data?.trendHistory?.length ?? 0) > 0;
  const isLoadingData =
    data === null && connectionStatus !== "offline" && !isInitialDataTimedOut;

  return {
    connectionStatus,
    data,
    incidentsTrend,
    hasTrendHistoryLoaded,
    isLoadingData,
    isInitialDataTimedOut,
    lastErrorReason,
    isRetryCooldown,
    isCreateIncidentSubmitting,
    services,
    createIncident,
    retryNow,
  };
};
