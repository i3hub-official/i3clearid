// turso.ts
import { createClient } from "@libsql/client";

export const turso = createClient({
  url: process.env.TURSO_DB_URL!, // same DB URL works
  authToken: process.env.TURSO_DB_AUTH!,
});
