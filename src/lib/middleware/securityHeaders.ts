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

      // Handle boolean values (like upgradeInsecureRequests and blockAllMixedContent)
      if (typeof values === "boolean") {
        return values ? directive : null;
      }

      // Handle array values (most directives)
      if (Array.isArray(values)) {
        return `${directive} ${values.join(" ")}`;
      }

      // Handle string values (if any)
      return `${directive} ${values}`;
    })
    .filter(Boolean) // Remove any null entries from boolean false values
    .join("; ");

  res.headers.set("Content-Security-Policy", cspDirectives);

  return res;
}
