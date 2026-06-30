import type {
  Incident,
  IncidentEvent,
  IncidentEventType,
  IncidentSeverity,
  IncidentStatus,
  Service,
} from "@package/dashboard-shared/contracts/dashboard";

const toIsoOrNow = (value: unknown): string => {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value as string | number | Date);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
};

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
  createdAt: toIsoOrNow(service.createdAt),
  updatedAt: toIsoOrNow(service.updatedAt),
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
  severity: incident.severity as IncidentSeverity,
  status: incident.status as IncidentStatus,
  createdAt: toIsoOrNow(incident.createdAt),
  updatedAt: toIsoOrNow(incident.updatedAt),
  resolvedAt: incident.resolvedAt ? toIsoOrNow(incident.resolvedAt) : null,
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
  type: event.type as IncidentEventType,
  message: event.message,
  severity: event.severity as IncidentSeverity | null,
  createdAt: toIsoOrNow(event.createdAt),
});
