'use client';

export type Tab = 'overview' | 'pillars' | 'hooks' | 'videos' | 'recommendations';

export const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'pillars', label: 'Content pillars' },
  { id: 'hooks', label: 'Hook analysis' },
  { id: 'videos', label: 'Top videos' },
  { id: 'recommendations', label: 'Recommendations' },
];

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export default function TabBar({ active, onChange }: Props) {
  return (
    <div style={{
      background: '#ffffff',
      borderBottom: '1px solid #e5e5e0',
      display: 'flex',
      padding: '0 24px',
      flexShrink: 0,
    }}>
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              fontFamily: 'DM Sans',
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? '#111111' : '#888888',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: isActive ? '2px solid #c8f060' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
