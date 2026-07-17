import type { AnalysisReport } from '@/lib/types';

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

export default function HookAnalysisTab({ report }: Props) {
  const { hookAnalysis } = report;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Card 1: hook types + best hook */}
      <div style={{
        background: '#ffffff', border: '1px solid #e5e5e0',
        borderRadius: 12, padding: '18px 20px',
      }}>
        <SectionLabel>Dominant hook types</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {hookAnalysis.dominantHookTypes.map((h, i) => (
            <span key={i} style={{
              background: 'rgba(200,240,96,0.15)',
              color: '#6a8c0a',
              border: '1px solid rgba(150,190,30,0.3)',
              borderRadius: 20, fontSize: 11,
              padding: '4px 10px',
              fontFamily: 'DM Sans',
            }}>
              {h}
            </span>
          ))}
        </div>

        {/* Best hook callout — dark element */}
        <SectionLabel>Best hook example</SectionLabel>
        <div style={{
          background: '#1a1a1a',
          borderLeft: '2px solid #c8f060',
          padding: '10px 14px',
          borderRadius: '0 8px 8px 0',
        }}>
          <div style={{
            fontFamily: 'Space Grotesk', fontSize: 10, color: '#555555',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
          }}>
            Best hook
          </div>
          <p style={{
            fontFamily: 'DM Sans', fontSize: 12, color: '#dddddd',
            lineHeight: 1.55, margin: 0,
          }}>
            {hookAnalysis.bestHookExample}
          </p>
        </div>
      </div>

      {/* Card 2: weaknesses + recommendation */}
      <div style={{
        background: '#ffffff', border: '1px solid #e5e5e0',
        borderRadius: 12, padding: '18px 20px',
      }}>
        <SectionLabel>Weaknesses</SectionLabel>
        <ul style={{ margin: '0 0 16px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {hookAnalysis.weaknesses.map((w, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#e5484d', fontWeight: 600, flexShrink: 0, lineHeight: 1.5 }}>×</span>
              <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#555555', lineHeight: 1.5 }}>{w}</span>
            </li>
          ))}
        </ul>

        <div style={{ borderTop: '1px solid #e5e5e0', marginBottom: 16 }} />

        <SectionLabel>Recommendation</SectionLabel>
        <div style={{
          background: 'rgba(200,240,96,0.08)',
          border: '1px solid rgba(150,190,30,0.25)',
          borderRadius: 10, padding: '14px 16px',
        }}>
          <p style={{
            fontFamily: 'DM Sans', fontSize: 12, color: '#4a6800',
            lineHeight: 1.6, margin: 0,
          }}>
            {hookAnalysis.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
