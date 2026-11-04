import type { ColumnType, Generated } from "kysely";

type GeneratedTimestamp = ColumnType<
  Date,
  Date | string | undefined,
  Date | string
>;
type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Tables {
  services: ServiceRow;
  incidents: IncidentRow;
  incident_events: IncidentEventRow;
  dashboard_snapshot: DashboardSnapshotRow;
}

interface ServiceRow {
  id: string;
  name: string;
  team: string;
  isActive: Generated<boolean>;
  createdAt: GeneratedTimestamp;
  updatedAt: GeneratedTimestamp;
}

interface IncidentRow {
  id: string;
  serviceId: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  createdAt: GeneratedTimestamp;
  updatedAt: GeneratedTimestamp;
  resolvedAt: Timestamp | null;
}

interface IncidentEventRow {
  id: string;
  incidentId: string;
  type: string;
  message: string;
  severity: string | null;
  createdAt: GeneratedTimestamp;
}

interface DashboardSnapshotRow {
  id: string;
  openCount: number;
  criticalCount: number;
  warningCount: number;
  avgResponseTime: number;
  lastUpdatedAt: GeneratedTimestamp;
}
