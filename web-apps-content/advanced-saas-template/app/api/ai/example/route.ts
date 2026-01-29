import { complete } from '@/lib/ai/service';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { prompt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  try {
    const text = await complete(prompt);
    return NextResponse.json({ result: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'AI request failed' },
      { status: 500 }
    );
  }
}
