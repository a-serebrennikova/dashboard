import { z } from "zod";

export const INCIDENT_SEVERITIES = ["critical", "warning", "info"] as const;

export const INCIDENT_STATUSES = ["open", "investigating", "resolved"] as const;

export const INCIDENT_EVENT_TYPES = ["created", "updated", "comment", "resolved"] as const;

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  team: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const incidentSeveritySchema = z.enum(INCIDENT_SEVERITIES);

export const incidentStatusSchema = z.enum(INCIDENT_STATUSES);

export const createIncidentInputSchema = z.object({
  serviceId: z.string().trim().min(1, "Service is required"),
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(1000).nullable(),
  incidentAt: z.string().datetime("Incident time is invalid"),
  severity: incidentSeveritySchema,
  status: incidentStatusSchema,
});

export const incidentEventTypeSchema = z.enum(INCIDENT_EVENT_TYPES);

export const incidentSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  serviceName: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  severity: incidentSeveritySchema,
  status: incidentStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  resolvedAt: z.string().nullable(),
});

export const incidentEventSchema = z.object({
  id: z.string(),
  incidentId: z.string(),
  incidentTitle: z.string(),
  serviceName: z.string(),
  type: incidentEventTypeSchema,
  message: z.string(),
  severity: incidentSeveritySchema.nullable(),
  createdAt: z.string(),
});

export const incidentsTrendPointSchema = z.object({
  second: z.string(),
  timestampMs: z.number(),
  total: z.number(),
  critical: z.number(),
  warning: z.number(),
});

export const dashboardPayloadSchema = z.object({
  generatedAt: z.string(),
  incidents: z.array(incidentSchema),
  events: z.array(incidentEventSchema),
  trendHistory: z.array(incidentsTrendPointSchema).optional(),
});

export const dashboardInitPayloadSchema = dashboardPayloadSchema.extend({
  trendHistory: z.array(incidentsTrendPointSchema),
});

export type Service = z.infer<typeof serviceSchema>;
export type IncidentSeverity = z.infer<typeof incidentSeveritySchema>;
export type IncidentStatus = z.infer<typeof incidentStatusSchema>;
export type IncidentEventType = z.infer<typeof incidentEventTypeSchema>;
export type Incident = z.infer<typeof incidentSchema>;
export type IncidentEvent = z.infer<typeof incidentEventSchema>;
export type IncidentsTrendPoint = z.infer<typeof incidentsTrendPointSchema>;
export type DashboardPayload = z.infer<typeof dashboardPayloadSchema>;
export type DashboardInitPayload = z.infer<typeof dashboardInitPayloadSchema>;
export type CreateIncidentInput = z.infer<typeof createIncidentInputSchema>;
