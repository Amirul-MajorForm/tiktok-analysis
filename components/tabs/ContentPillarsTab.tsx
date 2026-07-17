import type { AnalysisReport } from '@/lib/types';

const PILLAR_COLORS = ['#378ADD', '#c8f060', '#f5a623', '#a78bfa', '#ff5c5c'];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: '#aaaaaa', marginBottom: 10,
  }}>
    {children}
  </div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    background: '#f5f5f2', border: '1px solid #e0e0db',
    color: '#888888', borderRadius: 5, fontSize: 10,
    padding: '2px 7px', fontFamily: 'DM Sans',
  }}>
    {children}
  </span>
);

interface Props { report: AnalysisReport }

export default function ContentPillarsTab({ report }: Props) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {report.contentPillars.map((pillar, i) => (
        <div key={i} style={{
          background: '#ffffff', border: '1px solid #e5e5e0',
          borderRadius: 12, padding: '18px 20px',
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: PILLAR_COLORS[i], flexShrink: 0,
              }} />
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 13, color: '#111111' }}>
                {pillar.name}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge>{pillar.frequency}</Badge>
              <Badge>{pillar.count} posts</Badge>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontFamily: 'DM Sans', fontSize: 12, color: '#666666',
            lineHeight: 1.55, margin: '0 0 10px 0',
          }}>
            {pillar.description}
          </p>

          {/* Strategic purpose */}
          <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#aaaaaa', margin: '0 0 10px 0' }}>
            <span style={{ fontWeight: 500 }}>Strategic purpose: </span>
            {pillar.strategicPurpose}
          </p>

          {/* Top post pill */}
          {pillar.topPost && (
            <div style={{ borderTop: '1px solid #e5e5e0', paddingTop: 10 }}>
              <SectionLabel>Top post</SectionLabel>
              <span style={{
                background: '#f5f5f2', border: '1px solid #e0e0db',
                borderRadius: 5, fontSize: 10, padding: '3px 9px',
                color: '#888888', fontFamily: 'DM Sans',
              }}>
                {pillar.topPost}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
