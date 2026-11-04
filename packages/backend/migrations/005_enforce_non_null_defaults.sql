UPDATE services SET "isActive" = true WHERE "isActive" IS NULL;
UPDATE services SET "createdAt" = CURRENT_TIMESTAMP WHERE "createdAt" IS NULL;
UPDATE services SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

UPDATE incidents SET "createdAt" = CURRENT_TIMESTAMP WHERE "createdAt" IS NULL;
UPDATE incidents SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

UPDATE incident_events
SET "createdAt" = CURRENT_TIMESTAMP
WHERE "createdAt" IS NULL;

UPDATE dashboard_snapshot SET "openCount" = 0 WHERE "openCount" IS NULL;
UPDATE dashboard_snapshot SET "criticalCount" = 0 WHERE "criticalCount" IS NULL;
UPDATE dashboard_snapshot SET "warningCount" = 0 WHERE "warningCount" IS NULL;
UPDATE dashboard_snapshot SET "avgResponseTime" = 0 WHERE "avgResponseTime" IS NULL;
UPDATE dashboard_snapshot
SET "lastUpdatedAt" = CURRENT_TIMESTAMP
WHERE "lastUpdatedAt" IS NULL;

ALTER TABLE services
  ALTER COLUMN "isActive" SET NOT NULL,
  ALTER COLUMN "createdAt" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE incidents
  ALTER COLUMN "createdAt" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE incident_events
  ALTER COLUMN "createdAt" SET NOT NULL;

ALTER TABLE dashboard_snapshot
  ALTER COLUMN "openCount" SET NOT NULL,
  ALTER COLUMN "criticalCount" SET NOT NULL,
  ALTER COLUMN "warningCount" SET NOT NULL,
  ALTER COLUMN "avgResponseTime" SET NOT NULL,
  ALTER COLUMN "lastUpdatedAt" SET NOT NULL;
