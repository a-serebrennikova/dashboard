import { Kysely, PostgresDialect, SqliteDialect, type Generated } from "kysely";
import { Pool } from "pg";
import Database from "better-sqlite3";

interface Tables {
  services: ServiceRow;
  incidents: IncidentRow;
  incident_events: IncidentEventRow;
  dashboard_snapshot: DashboardSnapshotRow;
}

interface ServiceRow {
  id: Generated<string>;
  name: string;
  team: string;
  isActive: Generated<boolean>;
  createdAt: Generated<string>;
  updatedAt: Generated<string>;
}

interface IncidentRow {
  id: Generated<string>;
  serviceId: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  createdAt: Generated<string>;
  updatedAt: Generated<string>;
  resolvedAt: string | null;
}

interface IncidentEventRow {
  id: Generated<string>;
  incidentId: string;
  type: string;
  message: string;
  severity: string | null;
  createdAt: Generated<string>;
}

interface DashboardSnapshotRow {
  id: Generated<string>;
  openCount: number;
  criticalCount: number;
  warningCount: number;
  avgResponseTime: number;
  lastUpdatedAt: Generated<string>;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

export const db = databaseUrl.startsWith("postgresql")
  ? new Kysely<Tables>({
      dialect: new PostgresDialect({
        pool: new Pool({ connectionString: databaseUrl }),
      }),
    })
  : new Kysely<Tables>({
      dialect: new SqliteDialect({
        database: new Database(databaseUrl.replace("file:", "")),
      }),
    });

export default db;
