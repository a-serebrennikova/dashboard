import { db } from "../src/db";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    await db.deleteFrom("incident_events").execute();
    await db.deleteFrom("incidents").execute();
    await db.deleteFrom("dashboard_snapshot").execute();
    await db.deleteFrom("services").execute();

    // Создание сервисов
    const services = [
      { id: uuidv4(), name: "API Gateway", team: "Platform" },
      { id: uuidv4(), name: "Payment Service", team: "Payments" },
      { id: uuidv4(), name: "User Profile", team: "Identity" },
      { id: uuidv4(), name: "Database Cluster", team: "Infrastructure" },
      { id: uuidv4(), name: "Notification Service", team: "Communications" },
    ];

    await db.insertInto("services").values(services).execute();

    console.log(`  ✓ Created ${services.length} services`);

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

    console.log(`  ✓ Created ${incidents.length} incidents`);

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

    console.log(`  ✓ Created ${events.length} incident events`);

    // Снимок состояния
    const snapshot = {
      id: uuidv4(),
      openCount: 1,
      criticalCount: 1,
      warningCount: 1,
      avgResponseTime: 245,
    };

    await db.insertInto("dashboard_snapshot").values(snapshot).execute();

    console.log("  ✓ Created dashboard snapshot");
    console.log("✅ Seeding complete!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
