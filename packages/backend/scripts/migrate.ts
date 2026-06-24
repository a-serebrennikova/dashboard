import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!databaseUrl.startsWith("file:")) {
  throw new Error("Migrations only supported for SQLite locally");
}

const dbPath = databaseUrl.replace("file:", "");
const db = new Database(dbPath);

async function runMigrations() {
  console.log("🚀 Running migrations...");

  const migrationsDir = path.join(__dirname, "../migrations");
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    console.log(`  → ${file}`);
    db.exec(sql);
  }

  db.close();
  console.log("✅ Migrations complete!");
}

runMigrations().catch(console.error);
