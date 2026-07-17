'use client';

import { useState } from 'react';
import type { EnrichedPost } from '@/lib/types';
import { fmt } from '@/lib/fmt';

interface Props {
  post: EnrichedPost;
  rank?: number;
  variant?: 'top' | 'worst';
}

export default function VideoCard({ post, rank, variant = 'top' }: Props) {
  const [playing, setPlaying] = useState(false);

  const isWorst = variant === 'worst';
  const embedUrl = `https://www.tiktok.com/embed/v2/${post.id}`;

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    border: isWorst ? '1px solid #fde0e0' : '1px solid #e5e5e0',
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={cardStyle}>
      {/* Thumbnail — 16:9 */}
      <div style={{
        position: 'relative',
        paddingTop: '56.25%', // 16:9
        background: isWorst ? '#fdf0f0' : '#f5f5f2',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {playing ? (
          <iframe
            src={embedUrl}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            allow="autoplay; encrypted-media"
            title={post.text || 'TikTok video'}
          />
        ) : (
          <>
            {post.proxiedThumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.proxiedThumbnail}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" fill="#ffffff" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          </>
        )}

        {/* Rank badge */}
        {rank !== undefined && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            width: 22, height: 22, borderRadius: '50%',
            background: isWorst ? '#e5484d' : '#c8f060',
            color: isWorst ? '#ffffff' : '#111111',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 11,
            zIndex: 10,
          }}>
            {rank}
          </div>
        )}

        {/* Type badge */}
        {!playing && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,0.55)', color: '#dddddd',
            fontSize: 10, padding: '2px 7px', borderRadius: 4,
            fontFamily: 'DM Sans', zIndex: 10,
          }}>
            {post.videoType}
          </div>
        )}
      </div>

      {/* Caption + stats */}
      <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{
          fontFamily: 'DM Sans', fontSize: 11, color: '#666666',
          margin: 0, lineHeight: 1.45,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.text || '(no caption)'}
        </p>

        <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
          <StatItem label="Likes" value={fmt(post.likes)} />
          <StatItem label="Comments" value={fmt(post.comments)} />
          <StatItem label="Shares" value={fmt(post.shares)} />
          <StatItem label="Plays" value={fmt(post.plays)} isPlays />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, isPlays }: { label: string; value: string; isPlays?: boolean }) {
  return (
    <div>
      <div style={{
        fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 11,
        color: isPlays ? '#6a8c0a' : '#aaaaaa',
      }}>
        {value}
      </div>
      <div style={{ fontFamily: 'DM Sans', fontSize: 9, color: '#aaaaaa', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
    </div>
  );
}
