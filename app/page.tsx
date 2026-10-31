'use client';

import { useState, useEffect, useRef } from 'react';
import TopHeader from '@/components/TopHeader';
import ProfileHeader from '@/components/ProfileHeader';
import TabBar, { TABS } from '@/components/TabBar';
import type { Tab } from '@/components/TabBar';
import OverviewTab from '@/components/tabs/OverviewTab';
import ContentPillarsTab from '@/components/tabs/ContentPillarsTab';
import HookAnalysisTab from '@/components/tabs/HookAnalysisTab';
import TopVideosTab from '@/components/tabs/TopVideosTab';
import RecommendationsTab from '@/components/tabs/RecommendationsTab';
import type { AnalysisReport } from '@/lib/types';

type Stage = 'idle' | 'loading' | 'result' | 'error';

const PROGRESS_STEPS = [
  { pct: 5,  label: 'Connecting to TikTok scraper…' },
  { pct: 20, label: 'Scraping posts from profile…' },
  { pct: 45, label: 'Scraping posts from profile…' },
  { pct: 60, label: 'Sending data to Claude…' },
  { pct: 75, label: 'Analysing content pillars & hooks…' },
  { pct: 88, label: 'Building strategic report…' },
  { pct: 94, label: 'Almost done…' },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>('idle');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState('');
  const [progressPct, setProgressPct] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [profileUrl, setProfileUrl] = useState('');
  const [username, setUsername] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = () => {
    let step = 0;
    setProgressPct(PROGRESS_STEPS[0].pct);
    setProgressLabel(PROGRESS_STEPS[0].label);
    // Advance through steps over ~110 seconds total
    const intervals = [8000, 15000, 12000, 10000, 15000, 20000];
    const tick = () => {
      step++;
      if (step < PROGRESS_STEPS.length) {
        setProgressPct(PROGRESS_STEPS[step].pct);
        setProgressLabel(PROGRESS_STEPS[step].label);
        progressTimer.current = setTimeout(tick, intervals[step - 1] ?? 15000);
      }
    };
    progressTimer.current = setTimeout(tick, intervals[0]);
  };

  const stopProgress = (success: boolean) => {
    if (progressTimer.current) clearTimeout(progressTimer.current);
    if (success) {
      setProgressPct(100);
      setProgressLabel('Done!');
    }
  };

  useEffect(() => () => { if (progressTimer.current) clearTimeout(progressTimer.current); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.trim() || !username.trim()) return;
    setStage('loading');
    setError('');
    startProgress();
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileUrl: profileUrl.trim(),
          username: username.trim(),
          additionalContext: additionalContext.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { stopProgress(false); setError(data.error || 'Something went wrong'); setStage('error'); return; }
      stopProgress(true);
      setReport(data);
      setActiveTab('overview');
      setStage('result');
    } catch (err) {
      stopProgress(false);
      setError(err instanceof Error ? err.message : 'Network error');
      setStage('error');
    }
  };

  const reset = () => {
    setReport(null); setStage('idle'); setError('');
    setProfileUrl(''); setUsername(''); setAdditionalContext('');
    setProgressPct(0); setProgressLabel('');
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiktok-analysis-${report.profileSnapshot.handle.replace('@', '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Dashboard view ───────────────────────────────────────────────────────
  if (stage === 'result' && report) {
    return (
      <>
      <div id="dashboard-root" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f5f5f2' }}>
        <TopHeader onReset={reset} onDownloadPDF={handleDownloadPDF} onDownloadJSON={handleDownloadJSON} />
        <ProfileHeader report={report} />
        <TabBar active={activeTab} onChange={setActiveTab} />
        <div id="tab-content" style={{ flex: 1, overflowY: 'auto', padding: '24px' }} className="scrollbar-hide">
          {activeTab === 'overview' && <OverviewTab report={report} />}
          {activeTab === 'pillars' && <ContentPillarsTab report={report} />}
          {activeTab === 'hooks' && <HookAnalysisTab report={report} />}
          {activeTab === 'videos' && <TopVideosTab report={report} />}
          {activeTab === 'recommendations' && <RecommendationsTab report={report} />}
        </div>
      </div>

      {/* Full-report div — off-screen on screen, shown only at print time */}
      <div id="print-report" style={{ position: 'fixed', left: '-9999px', top: 0, width: '210mm' }} aria-hidden="true">
          <div style={{ padding: '32px', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: 22, marginBottom: 4 }}>{report.profileSnapshot.handle} — TikTok Analysis</h1>
            <p style={{ color: '#666', fontSize: 12, marginBottom: 24 }}>
              {report.profileSnapshot.niche} · {report.profileSnapshot.postsAnalysed} posts analysed
            </p>

            <h2 style={{ fontSize: 14, borderBottom: '1px solid #eee', paddingBottom: 6, marginBottom: 12 }}>Strategist Verdict</h2>
            <p style={{ fontSize: 12, color: '#333', lineHeight: 1.6, marginBottom: 24 }}>{report.strategistVerdict}</p>

            <h2 style={{ fontSize: 14, borderBottom: '1px solid #eee', paddingBottom: 6, marginBottom: 12 }}>Profile Snapshot</h2>
            <table style={{ fontSize: 11, borderCollapse: 'collapse', marginBottom: 24, width: '100%' }}>
              {[
                ['Niche', report.profileSnapshot.niche],
                ['Overall Tone', report.profileSnapshot.overallTone],
                ['Aesthetic', report.profileSnapshot.aestheticSummary],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '4px 12px 4px 0', color: '#888', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{k}</td>
                  <td style={{ padding: '4px 0', color: '#111' }}>{v}</td>
                </tr>
              ))}
            </table>

            <h2 style={{ fontSize: 14, borderBottom: '1px solid #eee', paddingBottom: 6, marginBottom: 12 }}>Engagement Patterns</h2>
            <table style={{ fontSize: 11, borderCollapse: 'collapse', marginBottom: 24, width: '100%' }}>
              {[
                ['Avg Likes / Post', report.engagementPatterns.avgLikesPerPost.toLocaleString()],
                ['Avg Comments / Post', report.engagementPatterns.avgCommentsPerPost.toLocaleString()],
                ['Avg Shares / Post', report.engagementPatterns.avgSharesPerPost.toLocaleString()],
                ['Avg Plays / Post', report.engagementPatterns.avgPlaysPerPost.toLocaleString()],
                ['Best Format', report.engagementPatterns.bestPerformingFormat],
                ['Best Pillar', report.engagementPatterns.bestPerformingPillar],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '4px 12px 4px 0', color: '#888', whiteSpace: 'nowrap' }}>{k}</td>
                  <td style={{ padding: '4px 0', color: '#111' }}>{v}</td>
                </tr>
              ))}
            </table>
            <p style={{ fontSize: 11, color: '#555', marginBottom: 24, lineHeight: 1.6 }}>{report.engagementPatterns.engagementInsight}</p>

            <h2 style={{ fontSize: 14, borderBottom: '1px solid #eee', paddingBottom: 6, marginBottom: 12 }}>Content Pillars</h2>
            {report.contentPillars.map((p, i) => (
              <div key={i} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: '3px solid #c8f060' }}>
                <strong style={{ fontSize: 12 }}>{p.name}</strong>
                <span style={{ fontSize: 10, color: '#888', marginLeft: 8 }}>{p.frequency} · {p.count} posts</span>
                <p style={{ fontSize: 11, color: '#555', margin: '4px 0 2px', lineHeight: 1.5 }}>{p.description}</p>
                <p style={{ fontSize: 10, color: '#888', margin: 0 }}>Purpose: {p.strategicPurpose}</p>
              </div>
            ))}

            <h2 style={{ fontSize: 14, borderBottom: '1px solid #eee', paddingBottom: 6, marginTop: 20, marginBottom: 12 }}>Hook Analysis</h2>
            <p style={{ fontSize: 11, color: '#333', margin: '0 0 4px' }}>
              <strong>Strength:</strong> {report.hookAnalysis.hookStrength} &nbsp;|&nbsp;
              <strong>Types:</strong> {report.hookAnalysis.dominantHookTypes.join(', ')}
            </p>
            <p style={{ fontSize: 11, color: '#555', margin: '0 0 4px', lineHeight: 1.5 }}>
              <strong>Best example:</strong> {report.hookAnalysis.bestHookExample}
            </p>
            <p style={{ fontSize: 11, color: '#555', margin: '0 0 4px', lineHeight: 1.5 }}>
              <strong>Recommendation:</strong> {report.hookAnalysis.recommendation}
            </p>
            {report.hookAnalysis.weaknesses.length > 0 && (
              <ul style={{ fontSize: 11, color: '#666', margin: '4px 0 0', paddingLeft: 18 }}>
                {report.hookAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            )}

            <h2 style={{ fontSize: 14, borderBottom: '1px solid #eee', paddingBottom: 6, marginTop: 20, marginBottom: 12 }}>Copy Strategy</h2>
            <table style={{ fontSize: 11, borderCollapse: 'collapse', marginBottom: 12, width: '100%' }}>
              {[
                ['Caption Length', report.copyStrategy.avgCaptionLength],
                ['Writing Style', report.copyStrategy.writingStyle],
                ['CTA Usage', report.copyStrategy.ctaUsage],
                ['Emoji Usage', report.copyStrategy.emojiUsage],
                ['Hashtag Strategy', report.copyStrategy.hashtagStrategy],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '3px 12px 3px 0', color: '#888', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{k}</td>
                  <td style={{ padding: '3px 0', color: '#111' }}>{v}</td>
                </tr>
              ))}
            </table>

            <h2 style={{ fontSize: 14, borderBottom: '1px solid #eee', paddingBottom: 6, marginTop: 20, marginBottom: 12 }}>Creative Opportunities</h2>
            {report.creativeOpportunities.map((o, i) => (
              <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: '3px solid #e5e5e0' }}>
                <strong style={{ fontSize: 12 }}>{o.opportunity}</strong>
                <p style={{ fontSize: 11, color: '#555', margin: '3px 0 2px', lineHeight: 1.5 }}>{o.rationale}</p>
                <p style={{ fontSize: 11, color: '#777', margin: 0 }}>How: {o.howTo}</p>
              </div>
            ))}

            <h2 style={{ fontSize: 14, borderBottom: '1px solid #eee', paddingBottom: 6, marginTop: 20, marginBottom: 12 }}>Paid Ad Potential</h2>
            <table style={{ fontSize: 11, borderCollapse: 'collapse', width: '100%' }}>
              {[
                ['Top Organic to Test', report.paidAdPotential.topOrganicToTest],
                ['Ad Formats', report.paidAdPotential.suggestedAdFormats.join(', ')],
                ['Audience Signals', report.paidAdPotential.audienceSignals],
                ['Creative Angle', report.paidAdPotential.creativeAngle],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '4px 12px 4px 0', color: '#888', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{k}</td>
                  <td style={{ padding: '4px 0', color: '#111' }}>{v}</td>
                </tr>
              ))}
            </table>

            <p style={{ marginTop: 32, fontSize: 10, color: '#aaa', borderTop: '1px solid #eee', paddingTop: 8 }}>
              Generated by Majorform TikTok Analysis · {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

      <style>{`
        @media print {
          #dashboard-root { display: none !important; }
          #print-report {
            position: static !important;
            left: auto !important;
            top: auto !important;
            width: auto !important;
            display: block !important;
            background: white;
          }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>
      </>
    );
  }

  // ─── Form / loading view ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f2', display: 'flex', flexDirection: 'column' }}>
      <TopHeader />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(200,240,96,0.12)', border: '1px solid rgba(150,190,30,0.3)',
              color: '#6a8c0a', borderRadius: 20, fontSize: 11,
              padding: '4px 12px', fontFamily: 'DM Sans', marginBottom: 16,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8aac0e' }} />
              Creative strategist mode
            </div>
            <h1 style={{
              fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 28,
              color: '#111111', margin: '0 0 10px 0', lineHeight: 1.2,
            }}>
              TikTok Profile Analysis
            </h1>
            <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#666666', margin: 0 }}>
              Enter a profile to get a deep creative strategist report.
            </p>
          </div>

          <div style={{
            background: '#ffffff', border: '1px solid #e5e5e0',
            borderRadius: 12, padding: '24px',
          }}>
            {error && (
              <div style={{
                background: '#fdf0f0', border: '1px solid #fde0e0',
                borderRadius: 8, padding: '12px 14px', marginBottom: 20,
                fontFamily: 'DM Sans', fontSize: 12, color: '#e5484d',
              }}>
                {error}
              </div>
            )}

            {stage === 'loading' ? (
              <div style={{ padding: '28px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <p style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 13, color: '#111111', margin: 0 }}>
                    {progressLabel}
                  </p>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#aaaaaa' }}>{progressPct}%</span>
                </div>
                {/* Track */}
                <div style={{ height: 6, background: '#e5e5e0', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg, #a8d820 0%, #c8f060 100%)',
                    borderRadius: 99,
                    transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>
                <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#aaaaaa', margin: '10px 0 0', textAlign: 'center' }}>
                  This takes up to 2 minutes
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 500, color: '#111111', display: 'block', marginBottom: 6 }}>
                    TikTok Profile URL
                  </label>
                  <input
                    type="url"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@username"
                    required
                    style={{
                      width: '100%', padding: '10px 12px',
                      border: '1px solid #e5e5e0', borderRadius: 8,
                      fontFamily: 'DM Sans', fontSize: 13, color: '#111111',
                      background: '#ffffff', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 500, color: '#111111', display: 'block', marginBottom: 6 }}>
                    Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      fontFamily: 'DM Sans', fontSize: 13, color: '#aaaaaa', pointerEvents: 'none',
                    }}>@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/^@/, ''))}
                      placeholder="username"
                      required
                      style={{
                        width: '100%', padding: '10px 12px 10px 26px',
                        border: '1px solid #e5e5e0', borderRadius: 8,
                        fontFamily: 'DM Sans', fontSize: 13, color: '#111111',
                        background: '#ffffff', outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 500, color: '#111111', display: 'block', marginBottom: 4 }}>
                    Additional context
                    <span style={{ fontFamily: 'DM Sans', fontWeight: 400, color: '#aaaaaa', marginLeft: 6 }}>optional</span>
                  </label>
                  <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#999999', margin: '0 0 6px' }}>
                    e.g. "focus on skincare audience", "they&apos;re launching in the US", "brand tone should be premium"
                  </p>
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Tell Claude anything that should inform the analysis…"
                    rows={3}
                    style={{
                      width: '100%', padding: '10px 12px',
                      border: '1px solid #e5e5e0', borderRadius: 8,
                      fontFamily: 'DM Sans', fontSize: 13, color: '#111111',
                      background: '#ffffff', outline: 'none',
                      boxSizing: 'border-box', resize: 'vertical',
                      lineHeight: 1.5,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: '#c8f060', color: '#111111',
                    border: 'none', borderRadius: 8,
                    padding: '12px', width: '100%',
                    fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13,
                    cursor: 'pointer', marginTop: 4,
                  }}
                >
                  Run Analysis
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <style>{`
        input:focus, textarea:focus { border-color: #c8f060 !important; box-shadow: 0 0 0 2px rgba(200,240,96,0.2); }
      `}</style>
    </div>
  );
}
