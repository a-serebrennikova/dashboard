import { db } from "../../db";

export const fetchServiceById = (serviceId: string) =>
  db
    .selectFrom("services")
    .selectAll()
    .where("id", "=", serviceId)
    .executeTakeFirst();

export const fetchActiveIncidents = () =>
  db
    .selectFrom("incidents")
    .select(["id", "title", "severity", "status", "serviceId"])
    .execute();

type NewIncident = {
  id: string;
  serviceId: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
};

type NewIncidentEvent = {
  id: string;
  incidentId: string;
  type: string;
  message: string;
  severity: string | null;
  createdAt: string;
};

export const insertIncidentWithEvent = async (
  incident: NewIncident,
  event: NewIncidentEvent,
) =>
  db.transaction().execute(async (trx) => {
    await trx.insertInto("incidents").values(incident).execute();
    await trx.insertInto("incident_events").values(event).execute();
  });

export const pruneIncidentEventsHistory = async (limit = 150) => {
  const outdatedEvents = await db
    .selectFrom("incident_events")
    .select("id")
    .orderBy("createdAt", "desc")
    .offset(limit)
    .execute();

  if (outdatedEvents.length === 0) {
    return;
  }

  await db
    .deleteFrom("incident_events")
    .where(
      "id",
      "in",
      outdatedEvents.map((event) => event.id),
    )
    .execute();
};
