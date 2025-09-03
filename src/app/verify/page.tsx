// app/verify/page.tsx
"use client";
import { useState } from "react";
import FormCard from "@/components/FormCard";
import { Consent } from "@/components/Consent";

type Method = "phone" | "email" | "nin" | "tracking_id" | "demography";

export default function VerifyPage() {
  const [method, setMethod] = useState<Method>("nin");
  const [loading, setLoading] = useState(false);
  type ResultData = Record<string, unknown> | null;
  const [result, setResult] = useState<ResultData>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/nin/lookup", { method: "POST", body: fd });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error || "Lookup failed");
    setResult(json.data);
  }

  return (
    <FormCard
      title="NIN Verification"
      subtitle="Verify via NIN, phone, email, tracking ID, or demographic data."
    >
      <form className="grid gap-4" onSubmit={submit}>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Method</span>
          <select
            name="method"
            value={method}
            onChange={(e) => setMethod(e.target.value as Method)}
            className="border rounded px-3 py-2"
          >
            <option value="nin">NIN</option>
            <option value="phone">Phone Number</option>
            <option value="email">Email Address</option>
            <option value="tracking_id">Tracking ID</option>
            <option value="demography">Demography</option>
          </select>
        </label>

        {method === "nin" && (
          <label className="grid gap-1">
            <span className="text-sm font-medium">NIN</span>
            <input name="nin" required className="border rounded px-3 py-2" />
          </label>
        )}
        {method === "phone" && (
          <label className="grid gap-1">
            <span className="text-sm font-medium">Registered Phone Number</span>
            <input name="phone" required className="border rounded px-3 py-2" />
          </label>
        )}
        {method === "email" && (
          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <input
              name="email"
              type="email"
              required
              className="border rounded px-3 py-2"
            />
          </label>
        )}
        {method === "tracking_id" && (
          <label className="grid gap-1">
            <span className="text-sm font-medium">Tracking ID</span>
            <input
              name="trackingId"
              required
              className="border rounded px-3 py-2"
            />
          </label>
        )}
        {method === "demography" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              name="firstName"
              placeholder="First name"
              className="border rounded px-3 py-2"
            />
            <input
              name="lastName"
              placeholder="Last name"
              className="border rounded px-3 py-2"
            />
            <input
              name="dob"
              type="date"
              placeholder="DOB"
              className="border rounded px-3 py-2"
            />
          </div>
        )}

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="consent" required />
          <span className="text-sm">
            I consent to verification with accredited providers
          </span>
        </label>
        <Consent />

        <button
          disabled={loading}
          className="bg-[var(--brand)] text-white px-4 py-2 rounded"
        >
          {loading ? "Verifying…" : "Verify"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {result && (
        <pre className="mt-4 p-3 bg-gray-50 border rounded text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </FormCard>
  );
}
