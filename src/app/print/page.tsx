// app/print/page.tsx
'use client';
import { useState } from 'react';
import FormCard from '@/components/FormCard';

export default function PrintPage() {
  const [html, setHtml] = useState<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/nin/print', { method: 'POST', body: fd });
    const { html } = await res.json();
    setHtml(html);
    // The user can Cmd/Ctrl+P the rendered section
  }

  return (
    <FormCard title="Print NIN Verification Page" subtitle="Generate a print-friendly verification page or deep-link to official slip printing.">
      <form className="grid gap-4" onSubmit={submit}>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Slip Type</span>
          <select name="type" className="border rounded px-3 py-2">
            <option value="verification">Verification Page</option>
            <option value="short-standard">Short Slip (Standard)</option>
            <option value="short-premium">Short Slip (Premium)</option>
            <option value="long-standard">Long Slip (Standard)</option>
            <option value="long-premium">Long Slip (Premium)</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">NIN</span>
          <input name="nin" required className="border rounded px-3 py-2" />
        </label>
        <button className="bg-[var(--brand)] text-white px-4 py-2 rounded">Generate</button>
      </form>

      {html && (
        <div className="mt-6 print-container">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}

      <p className="text-xs text-gray-600 mt-4">
        For official Improved NIN Slips and payments, use the NIMC portal/app. This page is a convenience copy for your records.
      </p>
    </FormCard>
  );
}
