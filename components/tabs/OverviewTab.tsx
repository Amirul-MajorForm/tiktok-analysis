import type { AnalysisReport, VideoType } from '@/lib/types';

const PILLAR_COLORS = ['#378ADD', '#c8f060', '#f5a623', '#a78bfa', '#ff5c5c'];

const SectionLabel = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <div style={{
    fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: dark ? '#555555' : '#aaaaaa',
    marginBottom: 10,
  }}>
    {children}
  </div>
);

interface Props { report: AnalysisReport }

export default function OverviewTab({ report }: Props) {
  const { strategistVerdict, contentPillars, allPosts } = report;

  // Video type counts
  const typeCounts: Record<string, number> = {};
  allPosts.forEach((p) => { typeCounts[p.videoType] = (typeCounts[p.videoType] || 0) + 1; });
  const total = allPosts.length || 1;

  const topTypes: VideoType[] = ['Talking Head', 'B-Roll', 'Text-on-Screen'];
  const typeStats = topTypes.map((t) => ({ label: t, count: typeCounts[t] || 0 }));

  // Pillar max for progress bar
  const maxCount = Math.max(...contentPillars.map((p) => p.count || 0), 1);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 16,
      maxWidth: 1100,
      margin: '0 auto',
    }}
      className="overview-grid"
    >
      {/* Left — strategist verdict (light card) */}
      <div style={{
        background: '#ffffff', border: '1px solid #e5e5e0',
        borderRadius: 12, padding: '18px 20px',
      }}>
        <SectionLabel>Strategist verdict</SectionLabel>
        <div style={{
          borderLeft: '2px solid #c8f060',
          paddingLeft: 14,
        }}>
          <div style={{
            fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 10,
            color: '#8aac0e', textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: 8,
          }}>
            Overall assessment
          </div>
          <p style={{
            fontFamily: 'DM Sans', fontSize: 12, color: '#555555',
            lineHeight: 1.65, margin: 0,
          }}>
            {strategistVerdict}
          </p>
        </div>

        {/* Aesthetic summary */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e5e0' }}>
          <SectionLabel>Aesthetic</SectionLabel>
          <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#666666', lineHeight: 1.6, margin: 0 }}>
            {report.profileSnapshot.aestheticSummary}
          </p>
        </div>
      </div>

      {/* Right — dark card */}
      <div style={{
        background: '#1a1a1a', border: '1px solid #2a2a2a',
        borderRadius: 12, padding: '18px 20px',
      }}>
        {/* Content pillar split */}
        <SectionLabel dark>Content pillar split</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {contentPillars.map((pillar, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: PILLAR_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#dddddd' }}>{pillar.name}</span>
                </div>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: '#888888' }}>
                  {pillar.count}
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: '#2a2a2a', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  borderRadius: 3,
                  background: PILLAR_COLORS[i],
                  width: `${Math.round((pillar.count / maxCount) * 100)}%`,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #2a2a2a', margin: '16px 0' }} />

        {/* Video type breakdown */}
        <SectionLabel dark>Video type breakdown</SectionLabel>
        <div style={{ display: 'flex', gap: 24 }}>
          {typeStats.map((t) => (
            <div key={t.label}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 18, color: '#ffffff', lineHeight: 1 }}>
                {t.count}
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#666666', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t.label}
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#555555', marginTop: 2 }}>
                {Math.round((t.count / total) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .overview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
