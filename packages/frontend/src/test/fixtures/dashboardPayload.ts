import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";

export const makeDashboardPayload = (
  overrides: Partial<DashboardPayload> = {},
): DashboardPayload => {
  const generatedAt = new Date("2026-06-27T10:00:00.000Z").toISOString();

  return {
    generatedAt,
    snapshot: {
      openCount: 4,
      criticalCount: 1,
      warningCount: 2,
      avgResponseTime: 180,
      lastUpdatedAt: generatedAt,
    },
    services: [
      {
        id: "svc-1",
        name: "Payments API",
        team: "Core",
        isActive: true,
        createdAt: generatedAt,
        updatedAt: generatedAt,
      },
    ],
    incidents: [
      {
        id: "inc-1",
        serviceId: "svc-1",
        serviceName: "Payments API",
        title: "Latency spike",
        description: null,
        severity: "warning",
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
