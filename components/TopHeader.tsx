interface Props {
  onReset?: () => void;
}

export default function TopHeader({ onReset }: Props) {
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
