CREATE TABLE dashboard_snapshot (
  id TEXT PRIMARY KEY,
  openCount INT DEFAULT 0,
  criticalCount INT DEFAULT 0,
  warningCount INT DEFAULT 0,
  avgResponseTime INT DEFAULT 0,
  lastUpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
