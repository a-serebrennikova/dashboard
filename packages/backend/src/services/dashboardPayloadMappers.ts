import type {
  Incident,
  IncidentEvent,
  IncidentEventType,
  IncidentSeverity,
  IncidentStatus,
  Service,
} from "@package/dashboard-shared/contracts/dashboard";

const INCIDENT_SEVERITIES: readonly IncidentSeverity[] = [
  "critical",
  "warning",
  "info",
];
const INCIDENT_STATUSES: readonly IncidentStatus[] = [
  "open",
  "investigating",
  "resolved",
];
const INCIDENT_EVENT_TYPES: readonly IncidentEventType[] = [
  "created",
  "updated",
  "comment",
  "resolved",
];

const isIncidentSeverity = (value: string): value is IncidentSeverity =>
  INCIDENT_SEVERITIES.some((severity) => severity === value);

const isIncidentStatus = (value: string): value is IncidentStatus =>
  INCIDENT_STATUSES.some((status) => status === value);

const isIncidentEventType = (value: string): value is IncidentEventType =>
  INCIDENT_EVENT_TYPES.some((type) => type === value);

const toIsoOrNow = (value: unknown): string => {
  if (!value) {
    return new Date().toISOString();
  }

  // SQLite DATETIME often comes as "YYYY-MM-DD HH:mm:ss" without timezone.
  // Treat such values as UTC to avoid local-time shifts after ISO conversion.
  if (typeof value === "string") {
    const hasTimezone = /Z|[+-]\d{2}:?\d{2}$/.test(value);
    const isSqlDateTime = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/.test(
      value,
    );

    if (isSqlDateTime && !hasTimezone) {
      const parsedUtc = new Date(value.replace(" ", "T") + "Z");
      if (!Number.isNaN(parsedUtc.getTime())) {
        return parsedUtc.toISOString();
      }
    }
  }

  if (
    !(
      typeof value === "string" ||
      typeof value === "number" ||
      value instanceof Date
    )
  ) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
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
  severity: isIncidentSeverity(incident.severity) ? incident.severity : "info",
  status: isIncidentStatus(incident.status) ? incident.status : "open",
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
  type: isIncidentEventType(event.type) ? event.type : "updated",
  message: event.message,
  severity:
    event.severity && isIncidentSeverity(event.severity)
      ? event.severity
      : null,
  createdAt: toIsoOrNow(event.createdAt),
});
