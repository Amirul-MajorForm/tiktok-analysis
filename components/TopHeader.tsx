interface Props {
  onReset?: () => void;
  onDownloadPDF?: () => void;
}

export default function TopHeader({ onReset, onDownloadPDF }: Props) {
  return (
    <header style={{
      height: 52,
      background: '#ffffff',
      borderBottom: '1px solid #e5e5e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15, color: '#111111' }}>
        Majorform
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans', fontSize: 12, color: '#888888' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8aac0e', display: 'inline-block' }} />
          Creative strategist mode
        </span>
        {onDownloadPDF && (
          <button
            onClick={onDownloadPDF}
            style={{
              border: '1px solid #c8f060',
              color: '#4a6600',
              borderRadius: 8,
              padding: '6px 14px',
              background: 'rgba(200,240,96,0.12)',
              fontFamily: 'DM Sans',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </button>
        )}
        {onReset && (
          <button
            onClick={onReset}
            style={{
              border: '1px solid #dddddd',
              color: '#555555',
              borderRadius: 8,
              padding: '6px 14px',
              background: 'transparent',
              fontFamily: 'DM Sans',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            New analysis
          </button>
        )}
      </div>
    </header>
  );
}
