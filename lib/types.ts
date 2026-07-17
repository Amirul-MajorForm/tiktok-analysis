export interface TikTokPost {
  text: string;
  likes: number;
  comments: number;
  shares: number;
  plays: number;
  createTime: number;
  videoUrl: string;
  covers?: { default?: string };
  hashtags?: string[];
  authorMeta?: { name?: string };
  webVideoUrl?: string;
  id?: string;
}

export interface ContentPillar {
  name: string;
  description: string;
  frequency: string;
  count: number;
  topPost: string;
  strategicPurpose: string;
}

export interface HookAnalysis {
  dominantHookTypes: string[];
  hookStrength: 'strong' | 'moderate' | 'weak';
  bestHookExample: string;
  weaknesses: string[];
  recommendation: string;
}

export interface CopyStrategy {
  avgCaptionLength: string;
  writingStyle: string;
  ctaUsage: string;
  emojiUsage: string;
  hashtagStrategy: string;
  copyStrengths: string[];
  copyGaps: string[];
}

export interface EngagementPatterns {
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  avgSharesPerPost: number;
  avgPlaysPerPost: number;
  bestPerformingFormat: string;
  bestPerformingPillar: string;
  engagementInsight: string;
}

export interface CreativeOpportunity {
  opportunity: string;
  rationale: string;
  howTo: string;
}

export interface PaidAdPotential {
  topOrganicToTest: string;
  suggestedAdFormats: string[];
  audienceSignals: string;
  creativeAngle: string;
}

export interface AnalysisReport {
  profileSnapshot: {
    handle: string;
    niche: string;
    postsAnalysed: number;
    overallTone: string;
    aestheticSummary: string;
  };
  contentPillars: ContentPillar[];
  hookAnalysis: HookAnalysis;
  copyStrategy: CopyStrategy;
  engagementPatterns: EngagementPatterns;
  creativeOpportunities: CreativeOpportunity[];
  paidAdPotential: PaidAdPotential;
  strategistVerdict: string;
  topVideos: EnrichedPost[];
  worstVideos: EnrichedPost[];
  allPosts: EnrichedPost[];
}

export interface EnrichedPost extends TikTokPost {
  engagementScore: number;
  videoType: VideoType;
  proxiedThumbnail?: string;
}

export type VideoType = 'Talking Head' | 'Duet' | 'Stitch' | 'B-Roll' | 'Text-on-Screen';
