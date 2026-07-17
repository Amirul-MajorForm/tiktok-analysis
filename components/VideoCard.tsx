'use client';

import type { EnrichedPost } from '@/lib/types';

interface Props {
  post: EnrichedPost;
  rank?: number;
  variant?: 'top' | 'worst';
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function VideoCard({ post, rank, variant = 'top' }: Props) {
  const borderColor = variant === 'top' ? 'border-brand-200' : 'border-red-100';
  const rankBg = variant === 'top' ? 'bg-brand-600 text-white' : 'bg-red-400 text-white';

  return (
    <div className={`rounded-2xl border ${borderColor} bg-surface overflow-hidden flex flex-col`}>
      <a
        href={post.webVideoUrl || `https://www.tiktok.com/@${post.authorName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-[9/16] bg-surface-subtle block group"
      >
        {post.proxiedThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.proxiedThumbnail}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-ink-muted" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition bg-white/90 text-ink text-xs font-semibold px-3 py-1.5 rounded-full">
            Watch on TikTok ↗
          </div>
        </div>

        {rank !== undefined && (
          <div className={`absolute top-2 left-2 w-7 h-7 rounded-full ${rankBg} flex items-center justify-center text-xs font-bold z-10`}>
            {rank}
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full z-10">
          {post.videoType}
        </div>
      </a>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="text-xs text-ink-secondary line-clamp-3 leading-relaxed">
          {post.text || '(no caption)'}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Stat icon="❤️" label="Likes" value={fmt(post.likes)} />
          <Stat icon="💬" label="Comments" value={fmt(post.comments)} />
          <Stat icon="↗️" label="Shares" value={fmt(post.shares)} />
          <Stat icon="▶️" label="Plays" value={fmt(post.plays)} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm">{icon}</span>
      <div>
        <div className="text-xs font-semibold text-ink">{value}</div>
        <div className="text-[10px] text-ink-muted">{label}</div>
      </div>
    </div>
  );
}
