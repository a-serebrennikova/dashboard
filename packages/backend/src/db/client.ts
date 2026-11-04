import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Tables } from "./schema";

export function createPostgresClient(databaseUrl: string): Kysely<Tables> {
  const { protocol } = new URL(databaseUrl);
  if (protocol !== "postgres:" && protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must use the postgres:// or postgresql:// scheme");
  }

  return new Kysely<Tables>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: databaseUrl }),
    }),
  });
}
