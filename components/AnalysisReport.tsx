'use client';

import type { AnalysisReport, EnrichedPost, VideoType } from '@/lib/types';
import VideoCard from './VideoCard';
import SectionCard from './SectionCard';
import Badge from './Badge';
import PieChart from './PieChart';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

function hookStrengthVariant(s: string) {
  if (s === 'strong') return 'green';
  if (s === 'moderate') return 'yellow';
  return 'red';
}

function buildVideoTypeData(posts: EnrichedPost[]) {
  const counts: Record<VideoType, number> = {
    'Talking Head': 0,
    Duet: 0,
    Stitch: 0,
    'B-Roll': 0,
    'Text-on-Screen': 0,
  };
  posts.forEach((p) => {
    counts[p.videoType] = (counts[p.videoType] || 0) + 1;
  });
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
}

function buildPillarData(pillars: AnalysisReport['contentPillars']) {
  return pillars.map((p) => ({ name: p.name, value: p.count || 0 }));
}

interface Props {
  report: AnalysisReport;
  onReset: () => void;
}

export default function AnalysisReportView({ report, onReset }: Props) {
  const videoTypeData = buildVideoTypeData(report.allPosts);
  const pillarData = buildPillarData(report.contentPillars);

  return (
    <div className="space-y-8">
      {/* Header strip */}
      <div className="bg-brand-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-brand-200 text-sm font-medium mb-1">Profile Analysis</div>
            <h1 className="font-heading text-3xl font-bold">{report.profileSnapshot.handle}</h1>
            <p className="text-brand-100 mt-1">{report.profileSnapshot.niche}</p>
          </div>
          <button
            onClick={onReset}
            className="text-brand-200 hover:text-white text-sm border border-brand-400 hover:border-white rounded-xl px-4 py-2 transition shrink-0"
          >
            New Analysis
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <SnapStat label="Posts Analysed" value={String(report.profileSnapshot.postsAnalysed)} />
          <SnapStat label="Overall Tone" value={report.profileSnapshot.overallTone} />
          <SnapStat label="Avg Likes" value={fmt(report.engagementPatterns.avgLikesPerPost)} />
          <SnapStat label="Avg Plays" value={fmt(report.engagementPatterns.avgPlaysPerPost)} />
        </div>
      </div>

      {/* Strategist Verdict */}
      <SectionCard title="Strategist Verdict" icon="🎯">
        <p className="text-ink-secondary leading-relaxed">{report.strategistVerdict}</p>
        <div className="mt-3 pt-3 border-t border-surface-border">
          <p className="text-sm text-ink-muted italic">{report.profileSnapshot.aestheticSummary}</p>
        </div>
      </SectionCard>

      {/* Top 3 Videos */}
      <div>
        <h2 className="font-heading font-semibold text-lg text-ink mb-4 flex items-center gap-2">
          <span>🏆</span> Top 3 Videos by Engagement
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {report.topVideos.map((v, i) => (
            <VideoCard key={i} post={v} rank={i + 1} variant="top" />
          ))}
        </div>
      </div>

      {/* Worst 3 Videos */}
      <div>
        <h2 className="font-heading font-semibold text-lg text-ink mb-4 flex items-center gap-2">
          <span>📉</span> Lowest 3 Videos by Engagement
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {report.worstVideos.map((v, i) => (
            <VideoCard key={i} post={v} rank={i + 1} variant="worst" />
          ))}
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart data={videoTypeData} title="Video Type Breakdown" />
        <PieChart data={pillarData} title="Content Pillar Distribution" />
      </div>

      {/* Content Pillars */}
      <SectionCard title="Content Pillars" icon="🏛️">
        <div className="space-y-4">
          {report.contentPillars.map((pillar, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-subtle border border-surface-border">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-heading font-semibold text-ink">{pillar.name}</h3>
                <div className="flex gap-2 shrink-0">
                  <Badge variant="blue">{pillar.frequency}</Badge>
                  <Badge>{pillar.count} posts</Badge>
                </div>
              </div>
              <p className="text-sm text-ink-secondary mb-2">{pillar.description}</p>
              <div className="text-xs text-ink-muted">
                <span className="font-medium text-ink-secondary">Strategic purpose:</span> {pillar.strategicPurpose}
              </div>
              {pillar.topPost && (
                <div className="mt-2 text-xs text-ink-muted border-t border-surface-border pt-2">
                  <span className="font-medium">Top post:</span> {pillar.topPost}
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Hook Analysis */}
      <SectionCard title="Hook Analysis" icon="🪝">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-ink-secondary">Strength:</span>
            <Badge variant={hookStrengthVariant(report.hookAnalysis.hookStrength) as 'green' | 'yellow' | 'red'}>
              {report.hookAnalysis.hookStrength}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium text-ink mb-1.5">Dominant Hook Types</div>
            <div className="flex flex-wrap gap-2">
              {report.hookAnalysis.dominantHookTypes.map((h, i) => (
                <Badge key={i}>{h}</Badge>
              ))}
            </div>
          </div>
          <InfoRow label="Best Hook Example" value={report.hookAnalysis.bestHookExample} />
          <div>
            <div className="text-sm font-medium text-ink mb-1.5">Weaknesses</div>
            <ul className="space-y-1">
              {report.hookAnalysis.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-ink-secondary flex gap-2">
                  <span className="text-red-400 shrink-0">✗</span> {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-3 rounded-xl bg-brand-50 border border-brand-200">
            <div className="text-xs font-semibold text-brand-700 mb-1 uppercase tracking-wide">Recommendation</div>
            <p className="text-sm text-brand-800">{report.hookAnalysis.recommendation}</p>
          </div>
        </div>
      </SectionCard>

      {/* Copy Strategy */}
      <SectionCard title="Copy Strategy" icon="✍️">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <InfoRow label="Avg Caption Length" value={report.copyStrategy.avgCaptionLength} />
          <InfoRow label="Writing Style" value={report.copyStrategy.writingStyle} />
          <InfoRow label="CTA Usage" value={report.copyStrategy.ctaUsage} />
          <InfoRow label="Emoji Usage" value={report.copyStrategy.emojiUsage} />
          <InfoRow label="Hashtag Strategy" value={report.copyStrategy.hashtagStrategy} className="sm:col-span-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ListSection title="Strengths ✓" items={report.copyStrategy.copyStrengths} variant="green" />
          <ListSection title="Gaps ✗" items={report.copyStrategy.copyGaps} variant="red" />
        </div>
      </SectionCard>

      {/* Engagement Patterns */}
      <SectionCard title="Engagement Patterns" icon="📊">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <StatTile label="Avg Likes" value={fmt(report.engagementPatterns.avgLikesPerPost)} />
          <StatTile label="Avg Comments" value={fmt(report.engagementPatterns.avgCommentsPerPost)} />
          <StatTile label="Avg Shares" value={fmt(report.engagementPatterns.avgSharesPerPost)} />
          <StatTile label="Avg Plays" value={fmt(report.engagementPatterns.avgPlaysPerPost)} />
        </div>
        <div className="space-y-3">
          <InfoRow label="Best Format" value={report.engagementPatterns.bestPerformingFormat} />
          <InfoRow label="Best Pillar" value={report.engagementPatterns.bestPerformingPillar} />
          <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border">
            <p className="text-sm text-ink-secondary">{report.engagementPatterns.engagementInsight}</p>
          </div>
        </div>
      </SectionCard>

      {/* Creative Opportunities */}
      <SectionCard title="Creative Opportunities" icon="💡">
        <div className="space-y-4">
          {report.creativeOpportunities.map((opp, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-subtle border border-surface-border">
              <h3 className="font-heading font-semibold text-ink mb-1">{opp.opportunity}</h3>
              <p className="text-sm text-ink-secondary mb-3">{opp.rationale}</p>
              <div className="p-3 rounded-lg bg-white border border-surface-border">
                <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">How To</div>
                <p className="text-sm text-ink">{opp.howTo}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Paid Ad Potential */}
      <SectionCard title="Paid Ad Potential" icon="🎯">
        <div className="space-y-4">
          <InfoRow label="Top Organic to Test" value={report.paidAdPotential.topOrganicToTest} />
          <InfoRow label="Audience Signals" value={report.paidAdPotential.audienceSignals} />
          <InfoRow label="Creative Angle" value={report.paidAdPotential.creativeAngle} />
          <div>
            <div className="text-sm font-medium text-ink mb-1.5">Suggested Ad Formats</div>
            <div className="flex flex-wrap gap-2">
              {report.paidAdPotential.suggestedAdFormats.map((f, i) => (
                <Badge key={i} variant="blue">{f}</Badge>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function SnapStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 rounded-xl p-3">
      <div className="text-brand-200 text-xs mb-1">{label}</div>
      <div className="text-white font-semibold text-sm">{value}</div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-subtle rounded-xl p-4 text-center border border-surface-border">
      <div className="font-heading text-2xl font-bold text-brand-600">{value}</div>
      <div className="text-xs text-ink-muted mt-1">{label}</div>
    </div>
  );
}

function InfoRow({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">{label}</span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  );
}

function ListSection({ title, items, variant }: { title: string; items: string[]; variant: 'green' | 'red' }) {
  const iconColor = variant === 'green' ? 'text-emerald-500' : 'text-red-400';
  const icon = variant === 'green' ? '✓' : '✗';
  return (
    <div>
      <div className="text-sm font-medium text-ink mb-2">{title}</div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-ink-secondary flex gap-2">
            <span className={`${iconColor} shrink-0`}>{icon}</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
