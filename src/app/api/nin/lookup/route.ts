import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { providerLookup } from "@/lib/providers";
import { getMethod, requireConsent } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    requireConsent(fd);

    const method = getMethod(fd);
    const payload: Record<string, string> = {};
    for (const [k, v] of fd.entries())
      if (typeof v === "string") payload[k] = v;

    const request = await prisma.nINRequest.create({
      data: {
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
        userAgent: req.headers.get("user-agent") ?? "",
        lookupMethod: method,
        input: payload,
        consent: true,
        provider: process.env.NIN_PROVIDER || "mock",
      },
    });

    const result = await providerLookup({ method, payload });

    await prisma.nINRequest.update({
      where: { id: request.id },
      data: {
        status: result.ok ? (result.data.status as string) || "matched" : "error",
        result: result.ok ? result.data : {},
        error: result.ok ? null : "error" in result && typeof result.error === "string" ? result.error : "Lookup failed",
      },
    });

    if (!result.ok)
      return NextResponse.json(
        { error: "error" in result && typeof result.error === "string" ? result.error : "Lookup failed" },
        { status: 400 }
      );

    return NextResponse.json({ data: result.data });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
