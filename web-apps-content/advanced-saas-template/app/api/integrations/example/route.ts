import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Example: outgoing API call to a third-party service.
 * Replace with your integration (e.g. send to CRM, analytics, or external API).
 * Use env vars for API keys; never expose secrets to the client.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiUrl = process.env.EXTERNAL_API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      { message: 'EXTERNAL_API_URL not set; this is a placeholder. Configure an external API URL to call.' },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: process.env.EXTERNAL_API_KEY
          ? `Bearer ${process.env.EXTERNAL_API_KEY}`
          : '',
      },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ success: res.ok, status: res.status, data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Integration request failed' },
      { status: 500 }
    );
  }
}
