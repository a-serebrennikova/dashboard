import {
  type IncidentEvent,
  type Service,
} from "@package/dashboard-shared/dashboard";
import { transformIsoOrNow } from "../../shared/transformIsoOrNow";
import { isIncidentEventType, isIncidentSeverity } from "../incidents/validation";
export const mapService = (service: {
  id: string;
  name: string;
  team: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}): Service => ({
  id: service.id,
  name: service.name,
  team: service.team,
  isActive: Boolean(service.isActive),
  createdAt: transformIsoOrNow(service.createdAt),
  updatedAt: transformIsoOrNow(service.updatedAt),
});

export const mapEvent = (event: {
  id: string;
  incidentId: string;
  incidentTitle: string;
  serviceName: string;
  type: string;
  message: string;
  severity: string | null;
  createdAt: Date | string;
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
