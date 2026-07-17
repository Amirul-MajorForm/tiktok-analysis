'use client';

import { useState } from 'react';
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

export default function Home() {
  const [stage, setStage] = useState<Stage>('idle');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [profileUrl, setProfileUrl] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.trim() || !username.trim()) return;
    setStage('loading');
    setError('');
    setProgress('Scraping TikTok profile via Apify…');
    const timeout = setTimeout(() => setProgress('Sending data to Claude for analysis…'), 30_000);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl: profileUrl.trim(), username: username.trim() }),
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); setStage('error'); return; }
      setReport(data);
      setActiveTab('overview');
      setStage('result');
    } catch (err) {
      clearTimeout(timeout);
      setError(err instanceof Error ? err.message : 'Network error');
      setStage('error');
    }
  };

  const reset = () => { setReport(null); setStage('idle'); setError(''); setProfileUrl(''); setUsername(''); };

  // ─── Dashboard view ───────────────────────────────────────────────────────
  if (stage === 'result' && report) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f5f5f2' }}>
        <TopHeader onReset={reset} />
        <ProfileHeader report={report} />
        <TabBar active={activeTab} onChange={setActiveTab} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }} className="scrollbar-hide">
          {activeTab === 'overview' && <OverviewTab report={report} />}
          {activeTab === 'pillars' && <ContentPillarsTab report={report} />}
          {activeTab === 'hooks' && <HookAnalysisTab report={report} />}
          {activeTab === 'videos' && <TopVideosTab report={report} />}
          {activeTab === 'recommendations' && <RecommendationsTab report={report} />}
        </div>
      </div>
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
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{
                  width: 40, height: 40, border: '3px solid #e5e5e0',
                  borderTopColor: '#c8f060', borderRadius: '50%',
                  margin: '0 auto 16px',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <p style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 14, color: '#111111', margin: '0 0 4px 0' }}>
                  {progress}
                </p>
                <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#aaaaaa', margin: 0 }}>
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
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: #c8f060 !important; box-shadow: 0 0 0 2px rgba(200,240,96,0.2); }
      `}</style>
    </div>
  );
}
