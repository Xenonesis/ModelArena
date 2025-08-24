import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { slug, apiKey } = await req.json();
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing slug' }, { status: 400 });
    }

    // Query OpenRouter model catalog
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      // Avoid caching so users get the freshest availability
      cache: 'no-store',
    });

    if (!res.ok) {
      // Forward status for clarity
      return NextResponse.json({ ok: false, error: 'Upstream error', status: res.status }, { status: 200 });
    }

    const data = await res.json();
    const list: Array<{ id: string; pricing?: Record<string, unknown> }> = data?.data || data?.models || [];
    const found = list.find((m) => m.id === slug);

    return NextResponse.json({ ok: true, exists: !!found });
  } catch (e: unknown) {
    const message = typeof e === 'object' && e && 'message' in e ? String((e as { message?: unknown }).message) : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}
