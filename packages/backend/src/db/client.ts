import Database from "better-sqlite3";
import { Kysely, PostgresDialect, SqliteDialect } from "kysely";
import { Pool } from "pg";
import type { Tables } from "./schema";

export function createDatabaseClient(databaseUrl: string) {
  return databaseUrl.startsWith("postgresql")
    ? new Kysely<Tables>({
        dialect: new PostgresDialect({
          pool: new Pool({ connectionString: databaseUrl }),
        }),
      })
    : new Kysely<Tables>({
        dialect: new SqliteDialect({
          database: new Database(databaseUrl.replace("file:", "")),
        }),
      });
}
