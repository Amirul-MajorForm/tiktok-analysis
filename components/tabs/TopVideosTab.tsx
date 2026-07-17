import type { AnalysisReport } from '@/lib/types';
import VideoCard from '@/components/VideoCard';

interface Props { report: AnalysisReport }

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 12,
};

export default function TopVideosTab({ report }: Props) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Top 3 */}
      <div>
        <div style={{
          fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: '#aaaaaa', marginBottom: 12,
        }}>
          Top 3 by engagement
        </div>
        <div style={gridStyle} className="video-grid">
          {report.topVideos.map((v, i) => (
            <VideoCard key={v.id || i} post={v} rank={i + 1} variant="top" />
          ))}
        </div>
      </div>

      {/* Bottom 3 */}
      <div>
        <div style={{
          fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: '#e5484d', marginBottom: 12,
        }}>
          Lowest 3 by engagement
        </div>
        <div style={gridStyle} className="video-grid">
          {report.worstVideos.map((v, i) => (
            <VideoCard key={v.id || i} post={v} rank={i + 1} variant="worst" />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) { .video-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .video-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
