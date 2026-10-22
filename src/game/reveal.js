import { PLANT_IDS } from './rules.js';

// Frames for the optional harvest reveal: flick through the tier's species, slowing down,
// and always end on the species the game already chose. Purely visual; it never changes the result.
export function revealFrames(tier, finalId, rng = Math.random, count = 12) {
  const ids = PLANT_IDS[tier];
  const frames = [];
  for (let i = 0; i < count - 1; i++) {
    const progress = i / count;
    // Quick at first, easing out over the last third.
    const delay = progress < 0.7 ? 80 + progress * 60 : 120 + ((progress - 0.7) / 0.3) ** 2 * 260;
    frames.push({ id: ids[Math.floor(rng() * ids.length)], delay: Math.round(delay) });
  }
  frames.push({ id: finalId, delay: 0 });
  return frames;
}

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
