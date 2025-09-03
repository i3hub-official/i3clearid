import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.nINRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        lookupMethod: true,
        status: true,
        provider: true,
        ref: true,
      },
    });
    return NextResponse.json({ data });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
