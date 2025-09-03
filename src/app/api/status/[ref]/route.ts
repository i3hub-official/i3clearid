import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { ref: string } }
) {
  try {
    const request = await prisma.nINRequest.findUnique({
      where: { ref: params.ref },
      select: {
        status: true,
        provider: true,
        createdAt: true,
        result: true,
        error: true,
      },
    });

    if (!request) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: request });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
