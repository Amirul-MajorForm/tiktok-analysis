import type { TikTokPost, VideoType } from './types';

export function inferVideoType(post: TikTokPost): VideoType {
  const text = String(post.text || '').toLowerCase();
  const tags = (post.hashtags || []).map((h) =>
    (typeof h === 'string' ? h : (h as { name?: string })?.name ?? '').toLowerCase()
  );
  const all = [text, ...tags].join(' ');

  if (all.includes('#duet') || all.includes('duet with')) return 'Duet';
  if (all.includes('#stitch') || all.includes('stitching')) return 'Stitch';
  if (
    all.includes('#textoverlay') ||
    all.includes('#textonscreen') ||
    all.includes('text on screen') ||
    all.includes('pov:') ||
    (text.match(/^[^a-z]*pov/i) && !all.includes('#duet'))
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
