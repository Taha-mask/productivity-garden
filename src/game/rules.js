// Compatibility facade: all calculations live in the shared engine.
import { REACT } from '../../shared/game/profiles.js';
import { rollWeighted, rollRewardSeed as reward, pickSpecies, stageAt as stage, growthProgress as progress } from '../../shared/game/rules.js';
import { createInitialState as initial, REACT_SPECIES } from '../../shared/game/transitions.js';
export { TIERS, BANK_SIZE, STAGES } from '../../shared/game/profiles.js';
export { rollWeighted };
export const STAGE_MS = REACT.stageMs;
export const REWARDS = REACT.rewards;
export const PLANT_IDS = Object.fromEntries(['basic', 'rare', 'extinct'].map(tier => [tier, REACT_SPECIES.filter(p => p.tier === tier).map(p => p.id)]));
export const rollRewardSeed = (tier, rng) => reward(tier, REACT, rng);
export const pickMatureId = (tier, rng) => pickSpecies(tier, REACT_SPECIES, rng);
export const stageAt = (plantedAt, now) => stage(plantedAt, now, REACT);
export const createInitialState = rng => initial(REACT, rng);

export const growthProgress = (plantedAt, now) => progress(plantedAt, now, REACT);
