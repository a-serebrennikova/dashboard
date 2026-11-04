import type { Incident } from "@package/dashboard-shared/dashboard";
import { transformIsoOrNow } from "../../shared/transformIsoOrNow";
import { isIncidentSeverity, isIncidentStatus } from "./validation";

export const mapIncident = (incident: {
  id: string;
  serviceId: string;
  serviceName: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  resolvedAt: Date | string | null;
}): Incident => ({
  id: incident.id,
  serviceId: incident.serviceId,
  serviceName: incident.serviceName,
  title: incident.title,
  description: incident.description,
  severity: isIncidentSeverity(incident.severity) ? incident.severity : "info",
  status: isIncidentStatus(incident.status) ? incident.status : "open",
  createdAt: transformIsoOrNow(incident.createdAt),
  updatedAt: transformIsoOrNow(incident.updatedAt),
  resolvedAt: incident.resolvedAt
    ? transformIsoOrNow(incident.resolvedAt)
    : null,
});
