// ========= Security Headers Middleware =========
import { NextResponse } from "next/server";
import { cspConfig } from "../security/cspConfig";

export async function withSecurityHeaders(): Promise<NextResponse> {
  const res = NextResponse.next();

  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=(self), payment=(self)"
  );
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  res.headers.set("X-XSS-Protection", "1; mode=block");

  // Generate CSP header with kebab-case directives
  const cspDirectives = Object.entries(cspConfig)
    .map(([key, values]) => {
      // Convert camelCase to kebab-case for the header
      const directive = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${directive} ${values.join(" ")}`;
    })
    .join("; ");
  res.headers.set("Content-Security-Policy", cspDirectives);

  return res;
}

