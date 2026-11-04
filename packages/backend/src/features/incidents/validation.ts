import {
  IncidentSeverity,
  IncidentStatus,
  IncidentEventType,
} from "@package/dashboard-shared/dashboard";
import {
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  INCIDENT_EVENT_TYPES,
} from "@package/dashboard-shared/dashboard";

export const isIncidentSeverity = (value: string): value is IncidentSeverity =>
  INCIDENT_SEVERITIES.some((severity) => severity === value);

export const isIncidentStatus = (value: string): value is IncidentStatus =>
  INCIDENT_STATUSES.some((status) => status === value);

export const isIncidentEventType = (
  value: string,
): value is IncidentEventType =>
  INCIDENT_EVENT_TYPES.some((type) => type === value);
