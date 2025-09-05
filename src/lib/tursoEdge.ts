// tursoEdge.ts
import { createClient } from "@libsql/client/web";

export const tursoEdge = createClient({
  url: process.env.TURSO_DB_URL!,       // move secrets to env
  authToken: process.env.TURSO_DB_AUTH!,
});
