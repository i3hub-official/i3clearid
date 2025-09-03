"use client";

import { useState } from "react";

interface StatusResponse {
  status: string;
  provider: string | null;
  createdAt: string;
  result?: string | Record<string, unknown> | null;
  error?: string | null;
}

export default function StatusPage() {
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setData(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/status/${encodeURIComponent(ref)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lookup failed");
      setData(json.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto py-12 space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        Check NIN Request Status
      </h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter your reference ID"
          className="flex-1 px-3 py-2 border rounded"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="p-4 border rounded bg-gray-50 space-y-2">
          <p>
            <strong>Status:</strong>{" "}
            <span className="capitalize">{data.status}</span>
          </p>
          <p>
            <strong>Provider:</strong> {data.provider || "N/A"}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(data.createdAt).toLocaleString()}
          </p>

          {data.error && (
            <p className="text-red-700">
              <strong>Error:</strong> {data.error}
            </p>
          )}

          {data.result && (
            <pre className="bg-white border rounded p-2 text-sm overflow-x-auto">
              {JSON.stringify(data.result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
