import { db } from "../../db";

type SimulationChanges = {
  snapshot: {
    id: string;
    openCount: number;
    criticalCount: number;
    warningCount: number;
    avgResponseTime: number;
    lastUpdatedAt: string;
  };
} & (
  | {
      incident: {
        id: string;
        status: string;
        severity: string;
        updatedAt: string;
        resolvedAt: string | null;
      };
      event: {
        id: string;
        incidentId: string;
        type: string;
        message: string;
        severity: string | null;
        createdAt: string;
      };
    }
  | { incident?: never; event?: never }
);

export const persistSimulationChanges = (changes: SimulationChanges) =>
  db.transaction().execute(async (trx) => {
    await trx
      .updateTable("dashboard_snapshot")
      .set({
        openCount: changes.snapshot.openCount,
        criticalCount: changes.snapshot.criticalCount,
        warningCount: changes.snapshot.warningCount,
        avgResponseTime: changes.snapshot.avgResponseTime,
        lastUpdatedAt: changes.snapshot.lastUpdatedAt,
      })
      .where("id", "=", changes.snapshot.id)
      .execute();

    if (changes.incident && changes.event) {
      await trx
        .updateTable("incidents")
        .set({
          status: changes.incident.status,
          severity: changes.incident.severity,
          updatedAt: changes.incident.updatedAt,
          resolvedAt: changes.incident.resolvedAt,
        })
        .where("id", "=", changes.incident.id)
        .execute();

      await trx.insertInto("incident_events").values(changes.event).execute();
    }
  });
