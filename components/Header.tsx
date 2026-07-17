export default function Header() {
  return (
    <header className="border-b border-surface-border bg-surface sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-heading font-700 text-xl text-ink tracking-tight">Majorform</span>
          <span className="text-surface-border">|</span>
          <span className="text-sm font-medium text-ink-secondary">TikTok Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted bg-surface-subtle border border-surface-border rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
            Creative Strategist Mode
          </span>
        </div>
      </div>
    </header>
  );
}
