import { z } from "zod";
import {
  incidentSeveritySchema,
  incidentStatusSchema,
} from "@package/dashboard-shared/dashboard";
import { CREATE_INCIDENT_FIELD_LIMITS } from "./consts";
import {
  getDatePart,
  getTimePart,
  getInitialIncidentAtLocal,
} from "./utils/dateTimeUtils";

const initialDateTime = getInitialIncidentAtLocal();

export const createIncidentSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(CREATE_INCIDENT_FIELD_LIMITS.title, "Title is too long"),
  description: z
    .string()
    .max(CREATE_INCIDENT_FIELD_LIMITS.description, "Description is too long")
    .optional(),
  incidentDate: z.string().min(1, "Date is required"),
  incidentTime: z.string().min(1, "Time is required"),
  severity: incidentSeveritySchema,
  status: incidentStatusSchema,
});

export type CreateIncidentFormValues = z.infer<typeof createIncidentSchema>;

export const getDefaultFormValues = (
  serviceId?: string,
): CreateIncidentFormValues => ({
  serviceId: serviceId ?? "",
  title: "",
  description: "",
  incidentDate: getDatePart(initialDateTime),
  incidentTime: getTimePart(initialDateTime),
  severity: "warning",
  status: "open",
});
