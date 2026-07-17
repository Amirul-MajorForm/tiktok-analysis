'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import AnalysisForm from '@/components/AnalysisForm';
import AnalysisReportView from '@/components/AnalysisReport';
import type { AnalysisReport } from '@/lib/types';

type Stage = 'idle' | 'loading' | 'result' | 'error';

export default function Home() {
  const [stage, setStage] = useState<Stage>('idle');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleSubmit = async (profileUrl: string, username: string) => {
    setStage('loading');
    setError('');
    setProgress('Scraping TikTok profile via Apify…');

    const timeout = setTimeout(() => setProgress('Sending data to Claude for analysis…'), 30_000);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl, username }),
      });

      clearTimeout(timeout);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setStage('error');
        return;
      }

      setReport(data);
      setStage('result');
    } catch (err) {
      clearTimeout(timeout);
      setError(err instanceof Error ? err.message : 'Network error');
      setStage('error');
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {stage === 'result' && report ? (
          <AnalysisReportView report={report} onReset={() => { setReport(null); setStage('idle'); }} />
        ) : (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
                </svg>
                TikTok Profile Analyser
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-3">
                Creative Strategy<br />in 60 Seconds
              </h1>
              <p className="text-ink-secondary text-base leading-relaxed">
                Enter a TikTok profile and get a deep creative strategist analysis — content pillars, hook strength, engagement patterns, and growth opportunities.
              </p>
            </div>

            <div className="bg-surface rounded-2xl border border-surface-border p-8 shadow-sm">
              {stage === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {stage === 'loading' ? (
                <div className="text-center py-8 space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <svg className="animate-spin w-16 h-16 text-brand-500" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ink">{progress}</p>
                    <p className="text-sm text-ink-muted mt-1">This can take up to 2 minutes</p>
                  </div>
                </div>
              ) : (
                <AnalysisForm onSubmit={handleSubmit} loading={false} />
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: '🎬', label: 'Last 50 Videos' },
                { icon: '🤖', label: 'Claude AI Analysis' },
                { icon: '📊', label: 'Structured Report' },
              ].map(({ icon, label }) => (
                <div key={label} className="text-xs text-ink-muted">
                  <div className="text-2xl mb-1">{icon}</div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
