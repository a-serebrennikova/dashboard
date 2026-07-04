import type { Incident } from "@package/dashboard-shared/contracts/dashboard";

const SERVICE_ID = "svc-1";
const SERVICE_NAME = "Payments API";
const BASE_TIMESTAMP = "2026-06-27T10:00:00.000Z";

export const firstIncidents: Incident[] = [
  {
    id: "inc-1",
    serviceId: SERVICE_ID,
    serviceName: SERVICE_NAME,
    title: "Latency spike",
    description: null,
    severity: "critical",
    status: "open",
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
    resolvedAt: null,
  },
  {
    id: "inc-2",
    serviceId: SERVICE_ID,
    serviceName: SERVICE_NAME,
    title: "Queue backlog",
    description: null,
    severity: "warning",
    status: "open",
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
    resolvedAt: null,
  },
  {
    id: "inc-3",
    serviceId: SERVICE_ID,
    serviceName: SERVICE_NAME,
    title: "Slow worker",
    description: null,
    severity: "warning",
    status: "investigating",
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
    resolvedAt: null,
  },
  {
    id: "inc-4",
    serviceId: SERVICE_ID,
    serviceName: SERVICE_NAME,
    title: "Manual review",
    description: null,
    severity: "info",
    status: "open",
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
    resolvedAt: null,
  },
];

export const secondIncidents: Incident[] = [
  ...firstIncidents,
  {
    id: "inc-5",
    serviceId: SERVICE_ID,
    serviceName: SERVICE_NAME,
    title: "Cache miss storm",
    description: null,
    severity: "critical",
    status: "open",
    createdAt: "2026-06-27T10:00:05.000Z",
    updatedAt: "2026-06-27T10:00:05.000Z",
    resolvedAt: null,
  },
  {
    id: "inc-6",
    serviceId: SERVICE_ID,
    serviceName: SERVICE_NAME,
    title: "Retry pressure",
    description: null,
    severity: "warning",
    status: "open",
    createdAt: "2026-06-27T10:00:05.000Z",
    updatedAt: "2026-06-27T10:00:05.000Z",
    resolvedAt: null,
  },
  {
    id: "inc-7",
    serviceId: SERVICE_ID,
    serviceName: SERVICE_NAME,
    title: "Pool saturation",
    description: null,
    severity: "warning",
    status: "investigating",
    createdAt: "2026-06-27T10:00:05.000Z",
    updatedAt: "2026-06-27T10:00:05.000Z",
    resolvedAt: null,
  },
];

export const createIncidentAt = (id: string, timestamp: string): Incident => ({
  ...firstIncidents[0],
  id,
  createdAt: timestamp,
  updatedAt: timestamp,
});
