interface Props {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ title, icon, children, className = '' }: Props) {
  return (
    <div className={`bg-surface rounded-2xl border border-surface-border p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        {icon && <span className="text-xl">{icon}</span>}
        <h2 className="font-heading font-semibold text-lg text-ink">{title}</h2>
      </div>
      {children}
    </div>
  );
}
