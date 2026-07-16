import { useEffect, useState } from "react";
import type {
  ConnectionStatus,
  IncidentsTrendPoint,
  LastErrorReason,
} from "../types/dashboard";
import {
  serviceSchema,
  type Service,
} from "@package/dashboard-shared/contracts/dashboard";
import { useDashboardSocketTransport } from "./useDashboardSocketTransport";
import { useIncidentsTrend } from "./useIncidentsTrend.ts";

const envWsUrl = import.meta.env.VITE_WS_URL?.trim();
const envWsUrlDev = import.meta.env.VITE_WS_URL_DEV?.trim();
const DEFAULT_WS_URL = import.meta.env.DEV
  ? (envWsUrlDev ?? envWsUrl)
  : envWsUrl;

type UseDashboardDataResult = {
  connectionStatus: ConnectionStatus;
  data: ReturnType<typeof useDashboardSocketTransport>["data"];
  incidentsTrend: IncidentsTrendPoint[];
  isInitialDataTimedOut: boolean;
  lastErrorReason: LastErrorReason;
  isRetryCooldown: boolean;
  services: Service[];
  retryNow: () => void;
};

const resolveHttpBaseUrl = (wsUrl: string): string => {
  try {
    const url = new URL(wsUrl);
    const protocol = url.protocol === "wss:" ? "https:" : "http:";
    return `${protocol}//${url.host}`;
  } catch {
    return window.location.origin;
  }
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

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = resolveHttpBaseUrl(url ?? window.location.origin);

    void fetch(`${baseUrl}/api/services`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load services (${response.status})`);
        }

        return response.json();
      })
      .then((payload: unknown) => {
        const parsedServices = serviceSchema.array().parse(payload);
        setServices(parsedServices);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to load services", error);
      });

    return () => {
      controller.abort();
    };
  }, [url]);

  const incidentsTrend = useIncidentsTrend(data, data?.trendHistory);

  return {
    connectionStatus,
    data,
    incidentsTrend,
    isInitialDataTimedOut,
    lastErrorReason,
    isRetryCooldown,
    services,
    retryNow,
  };
};
