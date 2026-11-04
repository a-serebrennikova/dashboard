CREATE TABLE dashboard_snapshot (
  id TEXT PRIMARY KEY,
  "openCount" INT NOT NULL DEFAULT 0,
  "criticalCount" INT NOT NULL DEFAULT 0,
  "warningCount" INT NOT NULL DEFAULT 0,
  "avgResponseTime" INT NOT NULL DEFAULT 0,
  "lastUpdatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
