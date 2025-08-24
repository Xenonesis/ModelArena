import { NextResponse } from 'next/server';

// GET /api/github/stars?owner=NiladriHazra&repo=Open-Fiesta
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner') || 'NiladriHazra';
    const repo = searchParams.get('repo') || 'Open-Fiesta';

    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      // Cache for 5 minutes at the edge if possible
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, status: res.status }, { status: 200 });
    }

    const data = await res.json();
    const stars = typeof data?.stargazers_count === 'number' ? data.stargazers_count : null;
    return NextResponse.json({ ok: true, stars }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
