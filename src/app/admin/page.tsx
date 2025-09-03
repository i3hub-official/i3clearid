"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/Badge";

interface NINRequest {
  id: string;
  createdAt: string;
  lookupMethod: string;
  status: string;
  provider: string;
  ref: string | null;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<NINRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/requests");
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        setRows(json.data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b text-left">
              <tr>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Method</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Provider</th>
                <th className="px-3 py-2">Ref</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">{r.lookupMethod}</td>
                  <td className="px-3 py-2">
                    <Badge>{r.status}</Badge>
                  </td>
                  <td className="px-3 py-2">{r.provider}</td>
                  <td className="px-3 py-2">{r.ref ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
