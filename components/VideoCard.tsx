'use client';

import { useState } from 'react';
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
  const [playing, setPlaying] = useState(false);

  const borderColor = variant === 'top' ? 'border-brand-200' : 'border-red-100';
  const rankBg = variant === 'top' ? 'bg-brand-600 text-white' : 'bg-red-400 text-white';

  return (
    <div className={`rounded-2xl border ${borderColor} bg-surface overflow-hidden flex flex-col`}>
      <div className="relative aspect-[9/16] bg-ink/5 cursor-pointer" onClick={() => setPlaying(true)}>
        {playing && post.proxiedVideoUrl ? (
          <video
            src={post.proxiedVideoUrl}
            autoPlay
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {post.proxiedThumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.proxiedThumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-subtle">
                <svg className="w-10 h-10 text-ink-muted" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}
        {rank !== undefined && (
          <div className={`absolute top-2 left-2 w-7 h-7 rounded-full ${rankBg} flex items-center justify-center text-xs font-bold`}>
            {rank}
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
          {post.videoType}
        </div>
      </div>

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

        <div className="pt-2 border-t border-surface-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-muted">Engagement score</span>
            <span className="font-semibold text-ink">{fmt(post.engagementScore)}</span>
          </div>
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
