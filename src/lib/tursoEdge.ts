// tursoEdge.ts
import { createClient } from "@libsql/client/web";

export const tursoEdge = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default tursoEdge;
