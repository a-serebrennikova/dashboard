import {
  type Incident,
  type IncidentEvent,
  type Service,
} from "@package/dashboard-shared/dashboard";
import { transformIsoOrNow } from "../transformIsoOrNow";
import {
  isIncidentEventType,
  isIncidentSeverity,
  isIncidentStatus,
} from "../utils";
export const mapService = (service: {
  id: string;
  name: string;
  team: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}): Service => ({
  id: service.id,
  name: service.name,
  team: service.team,
  isActive: Boolean(service.isActive),
  createdAt: transformIsoOrNow(service.createdAt),
  updatedAt: transformIsoOrNow(service.updatedAt),
});

export const mapIncident = (incident: {
  id: string;
  serviceId: string;
  serviceName: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
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

export const mapEvent = (event: {
  id: string;
  incidentId: string;
  incidentTitle: string;
  serviceName: string;
  type: string;
  message: string;
  severity: string | null;
  createdAt: string;
}): IncidentEvent => ({
  id: event.id,
  incidentId: event.incidentId,
  incidentTitle: event.incidentTitle,
  serviceName: event.serviceName,
  type: isIncidentEventType(event.type) ? event.type : "updated",
  message: event.message,
  severity:
    event.severity && isIncidentSeverity(event.severity)
      ? event.severity
      : null,
  createdAt: transformIsoOrNow(event.createdAt),
});
