import { prisma } from "./prisma";

export async function recordAudit(
  scope: string,
  requestId: string | null,
  actor: string,
  action: string,
  details: string | null
) {
  await prisma.auditEvent.create({
    data: { scope, requestId, actor, action, details },
  });
}
