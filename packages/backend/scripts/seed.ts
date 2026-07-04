import { db } from "../src/db";
import { logger } from "../src/logger";
import { v4 as uuidv4 } from "uuid";

const REQUIRED_TABLES = [
  "services",
  "incidents",
  "incident_events",
  "dashboard_snapshot",
] as const;

const ensureSchemaReady = async () => {
  for (const table of REQUIRED_TABLES) {
    await db.selectFrom(table).selectAll().limit(1).execute();
  }
};

async function seed() {
  logger.info("🌱 Seeding database...");

  try {
    logger.info("  → Checking schema (migrations must be applied)...");
    await ensureSchemaReady();
    logger.info("  ✓ Schema is ready");

    logger.info("  → Resetting data...");
    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom("incident_events").execute();
      await trx.deleteFrom("incidents").execute();
      await trx.deleteFrom("dashboard_snapshot").execute();
      await trx.deleteFrom("services").execute();

      // Создание сервисов
      const services = [
        { id: uuidv4(), name: "API Gateway", team: "Platform" },
        { id: uuidv4(), name: "Payment Service", team: "Payments" },
        { id: uuidv4(), name: "User Profile", team: "Identity" },
        { id: uuidv4(), name: "Database Cluster", team: "Infrastructure" },
        { id: uuidv4(), name: "Notification Service", team: "Communications" },
      ];

      await trx.insertInto("services").values(services).execute();

      logger.info(`  ✓ Created ${services.length} services`);

      // Создание инцидентов
      const incidents = [
        {
          id: uuidv4(),
          serviceId: services[0].id,
          title: "API Gateway returning 503",
          description: "Service unavailable due to load spike",
          severity: "critical",
          status: "resolved",
        },
        {
          id: uuidv4(),
          serviceId: services[1].id,
          title: "Payment processing timeout",
          description: "Payments taking longer than usual",
          severity: "critical",
          status: "investigating",
        },
        {
          id: uuidv4(),
          serviceId: services[3].id,
          title: "High memory usage",
          description: "Database cluster using 85% memory",
          severity: "warning",
          status: "open",
        },
      ];

      await trx.insertInto("incidents").values(incidents).execute();

      logger.info(`  ✓ Created ${incidents.length} incidents`);

      // События инцидентов
      const events = [
        {
          id: uuidv4(),
          incidentId: incidents[0].id,
          type: "created",
          message: "Incident detected automatically",
          severity: "critical",
        },
        {
          id: uuidv4(),
          incidentId: incidents[0].id,
          type: "resolved",
          message: "Services restored after restart",
          severity: null,
        },
        {
          id: uuidv4(),
          incidentId: incidents[1].id,
          type: "created",
          message: "Payment timeout spike detected",
          severity: "critical",
        },
        {
          id: uuidv4(),
          incidentId: incidents[1].id,
          type: "updated",
          message: "Root cause identified: connection pool exhausted",
          severity: null,
        },
        {
          id: uuidv4(),
          incidentId: incidents[2].id,
          type: "created",
          message: "Memory usage threshold exceeded",
          severity: "warning",
        },
      ];

      await trx.insertInto("incident_events").values(events).execute();

      logger.info(`  ✓ Created ${events.length} incident events`);

      // Снимок состояния
      const snapshot = {
        id: uuidv4(),
        openCount: 1,
        criticalCount: 1,
        warningCount: 1,
        avgResponseTime: 245,
      };

      await trx.insertInto("dashboard_snapshot").values(snapshot).execute();

      logger.info("  ✓ Data reset and seeded in one transaction");
    });

    logger.info("  ✓ Created dashboard snapshot");
    logger.info("✅ Seeding complete!");

    process.exit(0);
  } catch (error) {
    logger.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
