// src/lib/test/testConnections.ts
import "dotenv/config";
import { prisma } from "@/lib/prisma";
import turso from "@/lib/turso";
import tursoEdge from "@/lib/tursoEdge";

async function main() {
  console.log("Testing Prisma + Postgres…");
  try {
    const count = await prisma.user.count();
    console.log(`✅ Prisma connected, users count: ${count}`);
  } catch (err) {
    console.error("❌ Prisma failed:", err);
  }

  console.log("Testing Turso (Node client)…");
  try {
    await turso.execute("CREATE TABLE IF NOT EXISTS todos (description TEXT)");
    await turso.execute({
      sql: "INSERT INTO todos (description) VALUES (?)",
      args: ["Hello from Turso Node!"],
    });
    const res = await turso.execute("SELECT * FROM todos");
    console.log("✅ Turso (Node) connected, rows:", res.rows);
  } catch (err) {
    console.error("❌ Turso (Node) failed:", err);
  }

  console.log("Testing Turso (Edge client)…");
  try {
    await tursoEdge.execute(
      "CREATE TABLE IF NOT EXISTS todos_edge (description TEXT)"
    );
    await tursoEdge.execute({
      sql: "INSERT INTO todos_edge (description) VALUES (?)",
      args: ["Hello from Turso Edge!"],
    });
    const res = await tursoEdge.execute("SELECT * FROM todos_edge");
    console.log("✅ Turso (Edge) connected, rows:", res.rows);
  } catch (err) {
    console.error("❌ Turso (Edge) failed:", err);
  }

  process.exit(0);
}

main();
