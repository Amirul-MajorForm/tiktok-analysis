/** Raw shape returned by Apify clockworks~free-tiktok-scraper */
export interface ApifyPost {
  id?: string;
  text?: string;
  createTime?: number;
  // Apify field names for metrics
  diggCount?: number;
  commentCount?: number;
  shareCount?: number;
  playCount?: number;
  // Also possible nested under stats
  stats?: {
    diggCount?: number;
    commentCount?: number;
    shareCount?: number;
    playCount?: number;
  };
  // Also possible flat legacy names
  likes?: number;
  comments?: number;
  shares?: number;
  plays?: number;
  // Video / covers
  videoUrl?: string;
  video?: { downloadAddr?: string; cover?: string; playAddr?: string };
  covers?: { default?: string; origin?: string; dynamic?: string };
  imagePost?: { images?: { imageURL?: { urlList?: string[] } }[] };
  // Hashtags come back as objects
  hashtags?: Array<string | { name?: string; title?: string; id?: string }>;
  authorMeta?: { name?: string; nickName?: string };
  webVideoUrl?: string;
}

/** Normalized post we work with internally */
export interface TikTokPost {
  id: string;
  text: string;
  createTime: number;
  likes: number;
  comments: number;
  shares: number;
  plays: number;
  videoUrl: string;
  thumbnailUrl: string;
  hashtags: string[];
  authorName: string;
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
  proxiedThumbnail: string;
  proxiedVideoUrl: string;
}

export type VideoType = 'Talking Head' | 'Duet' | 'Stitch' | 'B-Roll' | 'Text-on-Screen';
