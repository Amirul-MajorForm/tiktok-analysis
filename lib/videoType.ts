import type { TikTokPost, VideoType } from './types';

export function inferVideoType(post: TikTokPost): VideoType {
  const text = String(post.text || '').toLowerCase();
  // hashtags are already normalized to string[] by normalizePost
  const tags = post.hashtags.map((h) => String(h).toLowerCase());
  const all = [text, ...tags].join(' ');

  if (all.includes('#duet') || all.includes('duet with')) return 'Duet';
  if (all.includes('#stitch') || all.includes('stitching')) return 'Stitch';
  if (
    all.includes('#textoverlay') ||
    all.includes('#textonscreen') ||
    all.includes('text on screen') ||
    /^pov[:\s]/i.test(post.text || '')
  )
    return 'Text-on-Screen';
  if (
    all.includes('#broll') ||
    all.includes('b-roll') ||
    all.includes('#aesthetic') ||
    all.includes('#cinematic')
  )
    return 'B-Roll';
  return 'Talking Head';
}
