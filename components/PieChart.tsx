'use client';

import { PieChart as RechartsPie, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface Props {
  data: DataItem[];
  title: string;
}

// Distinct, accessible palette — warm + cool mix, not monochrome
const PALETTE = [
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#10b981', // emerald
  '#f43f5e', // rose
  '#8b5cf6', // violet
  '#0ea5e9', // sky
  '#84cc16', // lime
  '#ec4899', // pink
];

function renderLegend(props: { payload?: { color: string; value: string }[] }) {
  const { payload = [] } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
      {payload.map((entry, i) => (
        <li key={i} className="flex items-center gap-1.5 text-xs text-ink-secondary max-w-[160px]">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="truncate">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PieChart({ data, title }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-6">
      <h3 className="font-heading font-semibold text-ink mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius={95}
            dataKey="value"
            label={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: number, _name: string) => [`${val} posts (${((val / total) * 100).toFixed(0)}%)`, '']}
            contentStyle={{ borderRadius: 12, border: '1px solid #e4e7ef', fontSize: 12 }}
          />
          <Legend content={renderLegend} />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
}
