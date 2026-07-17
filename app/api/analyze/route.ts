import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { ApifyPost, TikTokPost, EnrichedPost, AnalysisReport } from '@/lib/types';
import { inferVideoType } from '@/lib/videoType';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/** Normalize Apify's variable field names into our consistent TikTokPost shape */
function normalizePost(raw: ApifyPost, index: number): TikTokPost {
  // Metrics: Apify uses diggCount/commentCount/shareCount/playCount
  // Some versions nest under stats, some are flat
  const likes =
    raw.diggCount ?? raw.stats?.diggCount ?? raw.likes ?? 0;
  const comments =
    raw.commentCount ?? raw.stats?.commentCount ?? raw.comments ?? 0;
  const shares =
    raw.shareCount ?? raw.stats?.shareCount ?? raw.shares ?? 0;
  const plays =
    raw.playCount ?? raw.stats?.playCount ?? raw.plays ?? 0;

  // Video URL: prefer direct videoUrl, fallback to video.downloadAddr / video.playAddr
  const videoUrl =
    raw.videoUrl ||
    raw.video?.downloadAddr ||
    raw.video?.playAddr ||
    raw.webVideoUrl ||
    '';

  // Thumbnail: covers.default → video.cover → first image in imagePost
  const thumbnailUrl =
    raw.covers?.default ||
    raw.covers?.origin ||
    raw.video?.cover ||
    raw.imagePost?.images?.[0]?.imageURL?.urlList?.[0] ||
    '';

  // Hashtags: normalize string | {name} | {title}
  const hashtags = (raw.hashtags || []).map((h) => {
    if (typeof h === 'string') return h;
    return (h as { name?: string; title?: string }).name ||
      (h as { title?: string }).title ||
      '';
  }).filter(Boolean);

  return {
    id: raw.id || String(index),
    text: raw.text || '',
    createTime: raw.createTime || 0,
    likes,
    comments,
    shares,
    plays,
    videoUrl,
    thumbnailUrl,
    hashtags,
    authorName: raw.authorMeta?.name || raw.authorMeta?.nickName || '',
  };
}

function engagementScore(p: TikTokPost): number {
  return p.likes + p.comments * 3 + p.shares * 2;
}

function proxyUrl(url: string, type: 'media' | 'video' = 'media'): string {
  if (!url) return '';
  return `/api/${type}-proxy?url=${encodeURIComponent(url)}`;
}

function buildPostSummary(posts: TikTokPost[]): string {
  return posts
    .map((p, i) => {
      const tags = p.hashtags.map((h) => `#${h}`).join(' ');
      const date = p.createTime
        ? new Date(p.createTime * 1000).toISOString().split('T')[0]
        : 'unknown';
      return `Post ${i + 1} [${date}]
Caption: ${p.text.slice(0, 300)}
Hashtags: ${tags || 'none'}
Likes: ${p.likes} | Comments: ${p.comments} | Shares: ${p.shares} | Plays: ${p.plays}`;
    })
    .join('\n\n---\n\n');
}

const SYSTEM_PROMPT = `You are a senior creative strategist specialising in short-form video content and TikTok growth.
You analyse TikTok profiles with the precision of a performance marketer and the intuition of a creative director.
Be honest, specific, and commercially minded. Avoid vague platitudes.
Always return ONLY valid JSON — no markdown fences, no preamble, no trailing text.`;

const USER_PROMPT = (username: string, summary: string, postCount: number) =>
  `Analyse this TikTok profile (@${username}, ${postCount} posts) and return a JSON report with EXACTLY this shape:

{
  "profileSnapshot": {
    "handle": "@${username}",
    "niche": "string",
    "postsAnalysed": ${postCount},
    "overallTone": "string",
    "aestheticSummary": "string"
  },
  "contentPillars": [
    {
      "name": "string",
      "description": "string",
      "frequency": "string (e.g. 2x/week)",
      "count": <integer>,
      "topPost": "string (brief description of best post in this pillar)",
      "strategicPurpose": "string"
    }
  ],
  "hookAnalysis": {
    "dominantHookTypes": ["string"],
    "hookStrength": "strong|moderate|weak",
    "bestHookExample": "string",
    "weaknesses": ["string"],
    "recommendation": "string"
  },
  "copyStrategy": {
    "avgCaptionLength": "string",
    "writingStyle": "string",
    "ctaUsage": "string",
    "emojiUsage": "string",
    "hashtagStrategy": "string",
    "copyStrengths": ["string"],
    "copyGaps": ["string"]
  },
  "engagementPatterns": {
    "avgLikesPerPost": <number>,
    "avgCommentsPerPost": <number>,
    "avgSharesPerPost": <number>,
    "avgPlaysPerPost": <number>,
    "bestPerformingFormat": "string",
    "bestPerformingPillar": "string",
    "engagementInsight": "string"
  },
  "creativeOpportunities": [
    { "opportunity": "string", "rationale": "string", "howTo": "string" }
  ],
  "paidAdPotential": {
    "topOrganicToTest": "string",
    "suggestedAdFormats": ["string"],
    "audienceSignals": "string",
    "creativeAngle": "string"
  },
  "strategistVerdict": "string (3-4 honest sentences)"
}

Rules:
- contentPillars must have EXACTLY 5 items
- creativeOpportunities should have 3-5 items
- engagementPatterns numbers must be calculated from the actual post data
- handle must be "@${username}" — do not infer from post data
- Return ONLY the JSON object, nothing else

POST DATA:
${summary}`;

export async function POST(req: NextRequest) {
  try {
    const { profileUrl, username } = await req.json();
    if (!profileUrl || !username) {
      return NextResponse.json(
        { error: 'profileUrl and username are required' },
        { status: 400 }
      );
    }

    const cleanUsername = username.replace(/^@/, '').trim();

    // Call Apify
    const apifyUrl = `https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}&timeout=120&memory=1024`;

    const apifyRes = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profiles: [profileUrl],
        resultsPerPage: 50,
        shouldDownloadVideos: false,
        shouldDownloadCovers: false,
        shouldDownloadSubtitles: false,
        shouldDownloadSlideshowImages: false,
      }),
      signal: AbortSignal.timeout(150_000),
    });

    if (!apifyRes.ok) {
      const text = await apifyRes.text();
      console.error('Apify error', apifyRes.status, text);
      return NextResponse.json({ error: `Apify error: ${apifyRes.status}` }, { status: 502 });
    }

    const rawPosts: ApifyPost[] = await apifyRes.json();

    if (!Array.isArray(rawPosts) || rawPosts.length === 0) {
      return NextResponse.json(
        { error: 'No posts returned from Apify. Check the profile URL.' },
        { status: 422 }
      );
    }

    // Normalize all posts
    const posts: TikTokPost[] = rawPosts.map(normalizePost);

    // Enrich with computed fields
    const enriched: EnrichedPost[] = posts.map((p) => ({
      ...p,
      engagementScore: engagementScore(p),
      videoType: inferVideoType(p),
      proxiedThumbnail: proxyUrl(p.thumbnailUrl, 'media'),
      proxiedVideoUrl: proxyUrl(p.videoUrl, 'video'),
    }));

    const sorted = [...enriched].sort((a, b) => b.engagementScore - a.engagementScore);
    const topVideos = sorted.slice(0, 3);
    const worstVideos = sorted.slice(-3).reverse();

    // Build Claude prompt
    const summary = buildPostSummary(posts);
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 5000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: USER_PROMPT(cleanUsername, summary, posts.length) }],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    let claudeReport: Omit<AnalysisReport, 'topVideos' | 'worstVideos' | 'allPosts'>;

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      claudeReport = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      console.error('Claude JSON parse error', rawText.slice(0, 500));
      return NextResponse.json({ error: 'Failed to parse Claude response' }, { status: 500 });
    }

    // Force handle
    claudeReport.profileSnapshot.handle = `@${cleanUsername}`;
    claudeReport.profileSnapshot.postsAnalysed = posts.length;

    const report: AnalysisReport = {
      ...claudeReport,
      topVideos,
      worstVideos,
      allPosts: enriched,
    };

    return NextResponse.json(report);
  } catch (err) {
    console.error('analyze route error', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
