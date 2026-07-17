type Variant = 'default' | 'green' | 'yellow' | 'red' | 'blue';

const styles: Record<Variant, string> = {
  default: 'bg-surface-subtle text-ink-secondary border-surface-border',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  blue: 'bg-brand-50 text-brand-700 border-brand-200',
};

export default function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: Variant }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
}
