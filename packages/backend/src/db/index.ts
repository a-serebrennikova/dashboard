import { createPostgresClient } from "./client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

export const db = createPostgresClient(databaseUrl);
