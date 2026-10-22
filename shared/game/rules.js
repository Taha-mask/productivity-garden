import { STAGES } from './profiles.js';

export function rollWeighted(table, rng = Math.random) {
  let value = rng() * table.reduce((total, [, weight]) => total + weight, 0);
  for (const [outcome, weight] of table) {
    if (value < weight) return outcome;
    value -= weight;
  }
  return table.at(-1)[0];
}
export function rollRewardSeed(tier, profile, rng = Math.random) {
  return rollWeighted(profile.rewards[tier], rng);
}
export function pickSpecies(tier, catalogue, rng = Math.random) {
  const species = catalogue.filter(plant => plant.tier === tier);
  if (!species.length) throw new Error('Unknown seed tier');
  return species[Math.floor(rng() * species.length)].id;
}
export function stageAt(plantedAt, now, profile) {
  const elapsed = profile.clampNegativeTime ? Math.max(0, now - plantedAt) : now - plantedAt;
  return Math.min(STAGES, 1 + Math.floor(elapsed / profile.stageMs));
}

// Visual growth only: elapsed time never proves work or gates completion.
export function growthProgress(plantedAt, now, profile) {
  const elapsed = Math.max(0, now - plantedAt);
  const stage = Math.min(STAGES, 1 + Math.floor(elapsed / profile.stageMs));
  return { stage, remainingMs: stage === STAGES ? 0 : profile.stageMs - elapsed % profile.stageMs,
    fraction: stage === STAGES ? 1 : (elapsed % profile.stageMs) / profile.stageMs };
}
