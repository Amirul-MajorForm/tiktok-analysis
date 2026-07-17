import type { AnalysisReport } from '@/lib/types';

const ICONS = ['💡', '🎯', '📈', '🎬', '✨'];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: '#aaaaaa', marginBottom: 10,
  }}>
    {children}
  </div>
);

interface Props { report: AnalysisReport }

export default function RecommendationsTab({ report }: Props) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Creative opportunities */}
      {report.creativeOpportunities.map((opp, i) => (
        <div key={i} style={{
          background: '#ffffff', border: '1px solid #e5e5e0',
          borderRadius: 12, padding: '16px 18px',
          display: 'flex', gap: 14, alignItems: 'flex-start',
        }}>
          {/* Icon block */}
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>
            {ICONS[i % ICONS.length]}
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 13, color: '#111111', marginBottom: 6 }}>
              {opp.opportunity}
            </div>
            <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#666666', lineHeight: 1.55, margin: '0 0 10px 0' }}>
              {opp.rationale}
            </p>
            <div style={{ borderTop: '1px solid #e5e5e0', paddingTop: 10 }}>
              <SectionLabel>How to</SectionLabel>
              <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#555555', lineHeight: 1.55, margin: 0 }}>
                {opp.howTo}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Paid ad potential */}
      <div style={{
        background: '#ffffff', border: '1px solid #e5e5e0',
        borderRadius: 12, padding: '18px 20px',
        marginTop: 8,
      }}>
        <div style={{
          fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 13, color: '#111111', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>🎯</span> Paid ad potential
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Row label="Top organic to test" value={report.paidAdPotential.topOrganicToTest} />
          <Row label="Audience signals" value={report.paidAdPotential.audienceSignals} />
          <Row label="Creative angle" value={report.paidAdPotential.creativeAngle} />

          <div>
            <SectionLabel>Suggested ad formats</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {report.paidAdPotential.suggestedAdFormats.map((f, i) => (
                <span key={i} style={{
                  background: '#f5f5f2', border: '1px solid #e0e0db',
                  color: '#888888', borderRadius: 4, fontSize: 10,
                  padding: '2px 7px', fontFamily: 'DM Sans',
                }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{
        fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        color: '#aaaaaa', marginBottom: 4,
      }}>
        {label}
      </div>
      <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#555555', margin: 0, lineHeight: 1.55 }}>
        {value}
      </p>
    </div>
  );
}
