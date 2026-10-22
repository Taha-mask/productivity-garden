import { BANK_SIZE, REACT } from './profiles.js';
import { pickSpecies, rollRewardSeed } from './rules.js';

export const REACT_SPECIES = Object.freeze(
  ['basic', 'rare', 'extinct'].flatMap((tier, tierIndex) =>
    Array.from({ length: 5 }, (_, i) => Object.freeze({ id: ['b', 'r', 'e'][tierIndex] + (i + 1), tier }))),
);

// Only these adapters know the legacy field names; transitions work with one shape.
function decode(state, profile, catalogue) {
  if (!profile.speciesOnIssue) return state;
  return {
    bank: state.seeds, matured: state.counts,
    plants: state.garden.map(p => ({ ...p, tier: catalogue.find(c => c.id === p.seed)?.tier,
      plantedAt: p.created, matureId: p.done ? p.seed : null })),
  };
}
function encode(original, next, profile) {
  if (!profile.speciesOnIssue) return next;
  return { ...original, seeds: next.bank, counts: next.matured,
    garden: next.plants.map(p => {
      // Retain unrecognized legacy fields rather than stripping user data.
      const { tier, plantedAt, matureId, ...rest } = p;
      return { ...rest, created: plantedAt, done: Boolean(matureId) };
    }) };
}
export function createInitialState(profile = REACT, rng = Math.random, catalogue = REACT_SPECIES) {
  const bank = Array.from({ length: BANK_SIZE }, () => profile.speciesOnIssue ? pickSpecies('basic', catalogue, rng) : 'basic');
  return profile.speciesOnIssue ? { seeds: bank, garden: [], counts: {} }
    : { bank, plants: [], matured: {}, nextId: 1 };
}
export function transition(original, action, profile = REACT, rng = action.rng ?? Math.random, catalogue = REACT_SPECIES) {
  const state = decode(original, profile, catalogue);
  let next;
  switch (action.type) {
    case 'PLANT': {
      const seed = state.bank[action.slot], title = action.title?.trim();
      if (!seed || !title) return original;
      const bank = state.bank.slice(); bank[action.slot] = null;
      const common = { id: profile.speciesOnIssue ? action.id : state.nextId, title,
        x: action.x, y: action.y, plantedAt: action.now, matureId: null };
      const plant = profile.speciesOnIssue
        ? { ...common, seed, tier: catalogue.find(p => p.id === seed)?.tier }
        : { ...common, tier: seed };
      next = { ...state, bank, plants: [...state.plants, plant] };
      if (!profile.speciesOnIssue) next.nextId = state.nextId + 1;
      break;
    }
    case 'COMPLETE': {
      const plant = state.plants.find(p => p.id === action.id), free = state.bank.indexOf(null);
      if (!plant || plant.matureId || (free < 0 && profile.blockFullBankCompletion)) return original;
      // Preserve RNG consumption order and species-assignment timing for each entry.
      const matureId = profile.speciesOnIssue ? plant.seed : pickSpecies(plant.tier, catalogue, rng);
      const reward = rollRewardSeed(plant.tier, profile, rng);
      const rewardSeed = profile.speciesOnIssue ? pickSpecies(reward, catalogue, rng) : reward;
      const bank = state.bank.slice(); if (free >= 0) bank[free] = rewardSeed;
      next = { ...state, bank,
        plants: state.plants.map(p => p.id === plant.id ? { ...p, matureId } : p),
        matured: { ...state.matured, [matureId]: (state.matured[matureId] ?? 0) + 1 } };
      if (!profile.speciesOnIssue) next.lastReward = { plantId: plant.id, matureId, seed: reward };
      break;
    }
    case 'RENAME': {
      const title = typeof action.title === 'string' ? action.title.trim() : '';
      if (!title || title.length > 120 || !state.plants.some(p => p.id === action.id)) return original;
      next = { ...state, plants: state.plants.map(p => p.id === action.id ? { ...p, title } : p) };
      break;
    }
    case 'ARCHIVE_COMPLETED':
      if (!state.plants.some(p => p.matureId && !p.archived)) return original;
      // Archive changes visibility only; tasks and collection counts remain recoverable.
      next = { ...state, plants: state.plants.map(p => p.matureId ? { ...p, archived: true } : p) }; break;
    case 'RESTORE_ARCHIVED':
      if (!state.plants.some(p => p.archived)) return original;
      next = { ...state, plants: state.plants.map(p => p.archived ? { ...p, archived: false } : p) }; break;
    case 'UPROOT':
      if (profile.speciesOnIssue) return original;
      next = { ...state, plants: state.plants.filter(p => p.id !== action.id) }; break;
    case 'RESTART':
      if (profile.speciesOnIssue) return original;
      next = { ...createInitialState(profile, rng, catalogue), matured: state.matured, nextId: state.nextId }; break;
    default: return original;
  }
  return encode(original, next, profile);
}
export function isStuck(state) {
  return !state.bank.some(Boolean) && !state.plants.some(p => !p.matureId);
}
