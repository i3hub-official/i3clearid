// app/ipe/page.tsx
'use client';
import { useState } from 'react';
import FormCard from '@/components/FormCard';

export default function IPEPage() {
  const [done, setDone] = useState(false);
  const [ref, setRef] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/ipe/submit', { method: 'POST', body: fd });
    const json = await res.json();
    if (res.ok) { setDone(true); setRef(json.ref); }
  }

  return (
    <FormCard title="Submit IPE Status" subtitle="Report an IPE status for review and escalation via approved channels.">
      <form className="grid gap-4" onSubmit={submit}>
        <input name="nin" placeholder="NIN" className="border rounded px-3 py-2" required />
        <input name="trackingId" placeholder="Tracking ID (optional)" className="border rounded px-3 py-2" />
        <textarea name="notes" placeholder="Describe the issue (no sensitive data beyond NIN/Tracking ID)" className="border rounded px-3 py-2" />
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="consent" required />
          <span className="text-sm">I consent to processing for IPE resolution</span>
        </label>
        <button className="bg-[var(--brand)] text-white px-4 py-2 rounded">Submit</button>
      </form>

      {done && <p className="text-green-700 mt-4">Submitted. Reference: {ref}</p>}
      <p className="text-xs text-gray-600 mt-4">
        Note: IPE is handled by NIMC or accredited partners; we facilitate submission and status tracking only.
      </p>
    </FormCard>
  );
}
