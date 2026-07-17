import { NextRequest, NextResponse } from 'next/server';
import type { ApifyPost } from '@/lib/types';

export async function POST(req: NextRequest) {
  const { profileUrl } = await req.json();
  if (!profileUrl) return NextResponse.json({ error: 'profileUrl required' }, { status: 400 });

  const apifyUrl = `https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}&timeout=120&memory=1024`;

  const apifyRes = await fetch(apifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profiles: [profileUrl], resultsPerPage: 3 }),
    signal: AbortSignal.timeout(150_000),
  });

  const raw: ApifyPost[] = await apifyRes.json();
  const first = raw[0] ?? {};

  // Return the raw first post so we can see the exact field names and URL shapes
  return NextResponse.json({
    totalPosts: raw.length,
    firstPostKeys: Object.keys(first),
    firstPostRaw: first,
    urlFields: {
      videoUrl: (first as Record<string, unknown>).videoUrl,
      webVideoUrl: (first as Record<string, unknown>).webVideoUrl,
      video: (first as Record<string, unknown>).video,
      covers: (first as Record<string, unknown>).covers,
      imagePost: (first as Record<string, unknown>).imagePost,
    },
    metricFields: {
      diggCount: (first as Record<string, unknown>).diggCount,
      commentCount: (first as Record<string, unknown>).commentCount,
      shareCount: (first as Record<string, unknown>).shareCount,
      playCount: (first as Record<string, unknown>).playCount,
      stats: (first as Record<string, unknown>).stats,
    },
  });
}
