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

const PALETTE = [
  '#5c6bff', '#7a8fff', '#9db3ff', '#c3d1ff',
  '#4049f5', '#3438dc', '#2c2fb2', '#2a2e8d',
];

export default function PieChart({ data, title }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-6">
      <h3 className="font-heading font-semibold text-ink mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: number) => [`${val} posts`, '']}
            contentStyle={{ borderRadius: 12, border: '1px solid #e4e7ef', fontSize: 12 }}
          />
          <Legend iconType="circle" iconSize={8} />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
}
