import type { TikTokPost, VideoType } from './types';

export function inferVideoType(post: TikTokPost): VideoType {
  const text = String(post.text || '').toLowerCase();
  const tags = post.hashtags.map((h) => String(h).toLowerCase());
  const all = [text, ...tags].join(' ');

  // Duet / Stitch — explicit TikTok formats
  if (all.includes('#duet') || all.includes('duet with') || all.includes('dueting')) return 'Duet';
  if (all.includes('#stitch') || all.includes('stitching') || all.includes('#stitchthis')) return 'Stitch';

  // Text-on-screen — list posts, POV, countdown, "here are X" patterns
  if (
    /^pov[:\s]/i.test(post.text) ||
    /here are \d/i.test(post.text) ||
    /\d+ (things|ways|reasons|tips|cafes|spots|places)/i.test(post.text) ||
    all.includes('#textonscreen') ||
    all.includes('#textoverlay') ||
    all.includes('#storytime') ||
    all.includes('#greenscreen')
  )
    return 'Text-on-Screen';

  // B-Roll — aesthetic, food shots, location content, product-only shots
  if (
    all.includes('#broll') ||
    all.includes('b-roll') ||
    all.includes('#aesthetic') ||
    all.includes('#cinematic') ||
    all.includes('#foodphotography') ||
    all.includes('#foodie') ||
    all.includes('#recipevideo') ||
    all.includes('#satisfying') ||
    all.includes('#asmr') ||
    // product/food brand signals — no presenter, just shots
    (all.includes('#recipe') && !all.includes('i ') && !all.includes("i'")) ||
    (all.includes('#cafehopping') && !all.includes('we '))
  )
    return 'B-Roll';

  // Talking Head — someone speaking to camera (default for most brand content)
  return 'Talking Head';
}
