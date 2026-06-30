import { db } from "../src/db";
import { logger } from "../src/logger";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  logger.info("🌱 Seeding database...");

  try {
    // Удаление старых таблиц (в правильном порядке из-за foreign keys)
    logger.info("  → Dropping old tables...");
    await db.schema.dropTable("incident_events").ifExists().execute();
    await db.schema.dropTable("incidents").ifExists().execute();
    await db.schema.dropTable("dashboard_snapshot").ifExists().execute();
    await db.schema.dropTable("services").ifExists().execute();

    // Создание таблиц
    await db.schema
      .createTable("services")
      .addColumn("id", "uuid", (col) => col.primaryKey())
      .addColumn("name", "varchar", (col) => col.notNull())
      .addColumn("team", "varchar", (col) => col.notNull())
      .addColumn("isActive", "boolean", (col) => col.defaultTo(true))
      .addColumn("createdAt", "timestamp", (col) => col.defaultTo("now()"))
      .addColumn("updatedAt", "timestamp", (col) => col.defaultTo("now()"))
      .execute();

    await db.schema
      .createTable("incidents")
      .addColumn("id", "uuid", (col) => col.primaryKey())
      .addColumn("serviceId", "uuid", (col) =>
        col.notNull().references("services.id"),
      )
      .addColumn("title", "varchar", (col) => col.notNull())
      .addColumn("description", "text")
      .addColumn("severity", "varchar", (col) => col.notNull())
      .addColumn("status", "varchar", (col) => col.notNull())
      .addColumn("createdAt", "timestamp", (col) => col.defaultTo("now()"))
      .addColumn("updatedAt", "timestamp", (col) => col.defaultTo("now()"))
      .addColumn("resolvedAt", "timestamp")
      .execute();

    await db.schema
      .createTable("incident_events")
      .addColumn("id", "uuid", (col) => col.primaryKey())
      .addColumn("incidentId", "uuid", (col) =>
        col.notNull().references("incidents.id"),
      )
      .addColumn("type", "varchar", (col) => col.notNull())
      .addColumn("message", "text", (col) => col.notNull())
      .addColumn("severity", "varchar")
      .addColumn("createdAt", "timestamp", (col) => col.defaultTo("now()"))
      .execute();

    await db.schema
      .createTable("dashboard_snapshot")
      .addColumn("id", "uuid", (col) => col.primaryKey())
      .addColumn("openCount", "integer", (col) => col.notNull())
      .addColumn("criticalCount", "integer", (col) => col.notNull())
      .addColumn("warningCount", "integer", (col) => col.notNull())
      .addColumn("avgResponseTime", "integer", (col) => col.notNull())
      .addColumn("lastUpdatedAt", "timestamp", (col) => col.defaultTo("now()"))
      .addColumn("createdAt", "timestamp", (col) => col.defaultTo("now()"))
      .execute();

    logger.info("  ✓ Tables created");

    // Создание сервисов
    const services = [
      { id: uuidv4(), name: "API Gateway", team: "Platform" },
      { id: uuidv4(), name: "Payment Service", team: "Payments" },
      { id: uuidv4(), name: "User Profile", team: "Identity" },
      { id: uuidv4(), name: "Database Cluster", team: "Infrastructure" },
      { id: uuidv4(), name: "Notification Service", team: "Communications" },
    ];

    await db.insertInto("services").values(services).execute();

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

    await db.insertInto("incidents").values(incidents).execute();

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

    await db.insertInto("incident_events").values(events).execute();

    logger.info(`  ✓ Created ${events.length} incident events`);

    // Снимок состояния
    const snapshot = {
      id: uuidv4(),
      openCount: 1,
      criticalCount: 1,
      warningCount: 1,
      avgResponseTime: 245,
    };

    await db.insertInto("dashboard_snapshot").values(snapshot).execute();

    logger.info("  ✓ Created dashboard snapshot");
    logger.info("✅ Seeding complete!");

    process.exit(0);
  } catch (error) {
    logger.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
