import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type DbOptions = {
  onPoolError?: (error: Error) => void;
};

export function createDb(connectionString: string, options: DbOptions = {}) {
  void options;
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 5_000 });
  return drizzle({ client: pool, schema });
}

export type Db = ReturnType<typeof createDb>;

let db: Db | undefined;

export function getDb(): Db {
  if (!db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    db = createDb(url);
  }
  return db;
}

export async function pingDatabase(database: Db = getDb()): Promise<void> {
  await database.execute(sql`select 1`);
}
