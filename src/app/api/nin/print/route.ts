// app/api/nin/print/route.ts
import { NextRequest, NextResponse } from 'next/server';

// In real life, you would fetch official slip data or deep-link the user to NIMC portal/app. :contentReference[oaicite:8]{index=8}
export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const type = String(fd.get('type') || 'verification');
  const nin = String(fd.get('nin') || '');
  const title = type === 'verification' ? 'NIN Verification' : `NIN Slip (${type})`;

  const html = `
  <section style="font-family: system-ui; padding:24px; border:1px solid #e5e7eb; border-radius:8px">
    <header style="display:flex; align-items:center; gap:12px; margin-bottom:16px">
      <div style="width:32px; height:32px; background:#0A7E2A; border-radius:50%"></div>
      <h1 style="margin:0; font-size:20px">${title}</h1>
    </header>
    <div style="font-size:14px; color:#111">
      <p><strong>NIN:</strong> ${nin.replace(/\d(?=\d{4})/g,'*')}</p>
      <p><strong>Status:</strong> Verified</p>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>
    <footer style="margin-top:16px; font-size:12px; color:#666">
      This printout is for verification records. For official Improved NIN Slips, use the NIMC portal/app.
    </footer>
  </section>`;
  return NextResponse.json({ html });
}
