import { z } from "zod";

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  team: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const incidentSeveritySchema = z.enum(["critical", "warning", "info"]);

export const incidentStatusSchema = z.enum([
  "open",
  "investigating",
  "resolved",
]);

export const incidentEventTypeSchema = z.enum([
  "created",
  "updated",
  "comment",
  "resolved",
]);

export const dashboardSnapshotSchema = z.object({
  openCount: z.number(),
  criticalCount: z.number(),
  warningCount: z.number(),
  avgResponseTime: z.number(),
  lastUpdatedAt: z.string(),
});

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

export const dashboardPayloadSchema = z.object({
  generatedAt: z.string(),
  snapshot: dashboardSnapshotSchema,
  services: z.array(serviceSchema),
  incidents: z.array(incidentSchema),
  recentEvents: z.array(incidentEventSchema),
});

export type Service = z.infer<typeof serviceSchema>;
export type IncidentSeverity = z.infer<typeof incidentSeveritySchema>;
export type IncidentStatus = z.infer<typeof incidentStatusSchema>;
export type IncidentEventType = z.infer<typeof incidentEventTypeSchema>;
export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>;
export type Incident = z.infer<typeof incidentSchema>;
export type IncidentEvent = z.infer<typeof incidentEventSchema>;
export type DashboardPayload = z.infer<typeof dashboardPayloadSchema>;
