import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";

export const makeDashboardPayload = (
  overrides: Partial<DashboardPayload> = {},
): DashboardPayload => {
  const generatedAt = new Date("2026-06-27T10:00:00.000Z").toISOString();

  return {
    generatedAt,
    trendHistory: [
      {
        second: "10:00:00 AM",
        timestampMs: Date.parse("2026-06-27T09:55:00.000Z"),
        total: 3,
        critical: 1,
        warning: 1,
      },
      {
        second: "10:00:30 AM",
        timestampMs: Date.parse("2026-06-27T09:55:30.000Z"),
        total: 4,
        critical: 1,
        warning: 2,
      },
    ],
    incidents: [
      {
        id: "inc-1",
        serviceId: "svc-1",
        serviceName: "Payments API",
        title: "Latency spike",
        description: null,
        severity: "critical",
        status: "open",
        createdAt: generatedAt,
        updatedAt: generatedAt,
        resolvedAt: null,
      },
      {
        id: "inc-2",
        serviceId: "svc-1",
        serviceName: "Payments API",
        title: "Queue backlog",
        description: null,
        severity: "warning",
        status: "open",
        createdAt: generatedAt,
        updatedAt: generatedAt,
        resolvedAt: null,
      },
      {
        id: "inc-3",
        serviceId: "svc-1",
        serviceName: "Payments API",
        title: "Slow worker",
        description: null,
        severity: "warning",
        status: "investigating",
        createdAt: generatedAt,
        updatedAt: generatedAt,
        resolvedAt: null,
      },
      {
        id: "inc-4",
        serviceId: "svc-1",
        serviceName: "Payments API",
        title: "Manual review",
        description: null,
        severity: "info",
        status: "open",
        createdAt: generatedAt,
        updatedAt: generatedAt,
        resolvedAt: null,
      },
    ],
    recentEvents: [
      {
        id: "evt-1",
        incidentId: "inc-1",
        incidentTitle: "Latency spike",
        serviceName: "Payments API",
        type: "updated",
        message: "State refreshed",
        severity: "warning",
        createdAt: generatedAt,
      },
    ],
    ...overrides,
  };
};
