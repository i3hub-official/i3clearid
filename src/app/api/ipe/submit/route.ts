// app/api/ipe/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const fd = await req.formData();
  if (!fd.get("consent"))
    return NextResponse.json({ error: "Consent required" }, { status: 400 });
  const nin = String(fd.get("nin") || "");
  const trackingId = String(fd.get("trackingId") || "");
  const notes = String(fd.get("notes") || "");

  // Persist to your DB here. For demo, return a reference.
  const ref = crypto.randomUUID();
  const payload = {
    nin,
    trackingId,
    notes,
    ref,
    createdAt: new Date().toISOString(),
  };

  // Optionally forward to a partner ticketing/API when you have one.
  return NextResponse.json(payload);
}
