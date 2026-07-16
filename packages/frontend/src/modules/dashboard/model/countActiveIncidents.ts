import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";

export type ActiveIncidentCounts = {
  openCount: number;
  criticalCount: number;
  warningCount: number;
  otherCount: number;
};

export const countActiveIncidents = (
  incidents: DashboardPayload["incidents"],
): ActiveIncidentCounts => {
  const activeIncidents = incidents.filter(
    (incident) => incident.status !== "resolved",
  );

  const criticalCount = activeIncidents.filter(
    (incident) => incident.severity === "critical",
  ).length;
  const warningCount = activeIncidents.filter(
    (incident) => incident.severity === "warning",
  ).length;

  return {
    openCount: activeIncidents.length,
    criticalCount,
    warningCount,
    otherCount: Math.max(
      activeIncidents.length - criticalCount - warningCount,
      0,
    ),
  };
};
