import type { AnalysisReport } from '@/lib/types';
import { fmt } from '@/lib/fmt';

interface Props {
  report: AnalysisReport;
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 20, color: '#ffffff', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

export default function ProfileHeader({ report }: Props) {
  const { profileSnapshot, engagementPatterns } = report;
  const initials = profileSnapshot.handle.replace('@', '').slice(0, 2).toUpperCase();

  return (
    <div style={{
      background: '#1a1a1a',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      gap: 16,
    }}>
      {/* Left: avatar + handle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(200,240,96,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 14, color: '#c8f060',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15, color: '#ffffff' }}>
            {profileSnapshot.handle}
          </div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#888888', marginTop: 2 }}>
            TikTok · {profileSnapshot.niche}
          </div>
        </div>
      </div>

      {/* Right: stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <StatBlock label="Avg likes" value={fmt(engagementPatterns.avgLikesPerPost)} />
        <StatBlock label="Avg plays" value={fmt(engagementPatterns.avgPlaysPerPost)} />
        <StatBlock label="Avg comments" value={fmt(engagementPatterns.avgCommentsPerPost)} />
        <StatBlock label="Posts" value={String(profileSnapshot.postsAnalysed)} />
      </div>
    </div>
  );
}
