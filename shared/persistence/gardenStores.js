import { STANDALONE, REACT, TIERS, BANK_SIZE } from '../game/profiles.js';
import { REACT_SPECIES } from '../game/transitions.js';

export const PROFILES = Object.freeze([STANDALONE, REACT]);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const finite = Number.isFinite;
const counter = value => Number.isSafeInteger(value) && value >= 0;
export function validateGarden(state, profile, catalogue = REACT_SPECIES) {
  if (!object(state)) return false;
  const standalone = profile.speciesOnIssue;
  const bank = standalone ? state.seeds : state.bank;
  const plants = standalone ? state.garden : state.plants;
  const counts = standalone ? state.counts : state.matured;
  const ids = new Set(catalogue.map(p => p.id));
  if (!standalone && (state.legacyImported !== undefined && typeof state.legacyImported !== 'boolean'
    || state.legacySeedReserve !== undefined && (!Array.isArray(state.legacySeedReserve)
      || state.legacySeedReserve.some(seed => !TIERS.includes(seed))))) return false;
  if (!Array.isArray(bank) || bank.length !== BANK_SIZE || !Array.isArray(plants) || !object(counts)) return false;
  if (bank.some(seed => seed !== null && !(standalone ? ids.has(seed) : TIERS.includes(seed)))) return false;
  if (Object.entries(counts).some(([id, n]) => !ids.has(id) || !counter(n))) return false;
  const seen = new Set();
  for (const p of plants) {
    if (!object(p) || seen.has(p.id) || typeof p.title !== 'string' || !finite(p.x) || !finite(p.y)) return false;
    if (standalone) {
      if (typeof p.id !== 'string' || !p.id || !ids.has(p.seed) || !finite(p.created) || typeof p.done !== 'boolean') return false;
    } else if (!Number.isSafeInteger(p.id) || p.id < 1 || !TIERS.includes(p.tier) || !finite(p.plantedAt)
      || !(p.matureId === null || catalogue.some(c => c.id === p.matureId && c.tier === p.tier))) return false;
    seen.add(p.id);
    if (!standalone && p.legacySpecies !== undefined && !catalogue.some(c => c.id === p.legacySpecies && c.tier === p.tier)) return false;
  }
  return standalone || (Number.isSafeInteger(state.nextId) && state.nextId >= 1
    && plants.every(p => p.id < state.nextId));
}

export class GardenStoreError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
export const backupKey = profile => `${profile.key}:backup:pre-shared-v1`;

// Loading never writes. An invalid source remains untouched and cannot be committed.
export function createGardenStore(storage, profile, catalogue = REACT_SPECIES) {
  let expected, blocked = false, loaded = false;
  function load(fallback) {
    try {
      expected = storage.getItem(profile.key); loaded = true;
      if (expected === null) { blocked = false; return { state: fallback(), error: null }; }
      const state = JSON.parse(expected);
      if (!validateGarden(state, profile, catalogue)) throw new Error('Invalid garden');
      blocked = false; return { state, error: null };
    } catch {
      blocked = true;
      return { state: fallback(), error: new GardenStoreError('invalid', 'Saved garden could not be read. The original is preserved; changes are paused. Export your data or retry.') };
    }
  }
  function commit(state) {
    if (!loaded || blocked) throw new GardenStoreError('readonly', 'Changes are paused. Export your data or retry loading.');
    if (!validateGarden(state, profile, catalogue)) throw new GardenStoreError('invalid', 'The new garden is invalid; nothing was saved.');
    const raw = JSON.stringify(state);
    try {
      if (storage.getItem(profile.key) !== expected) throw new GardenStoreError('conflict', 'This garden changed in another tab. Retry to load the latest progress.');
      if (expected !== null) {
        const key = backupKey(profile);
        // A fixed pre-refactor snapshot is never silently replaced by later saves.
        if (storage.getItem(key) === null) {
          storage.setItem(key, expected);
          if (storage.getItem(key) !== expected) throw new GardenStoreError('backup', 'Backup verification failed; your original garden was not changed.');
        } else {
          let backup;
          try { backup = JSON.parse(storage.getItem(key)); } catch {}
          if (!validateGarden(backup, profile, catalogue)) throw new GardenStoreError('backup', 'An existing backup is unreadable. Export your data before continuing.');
        }
      }
      // Recheck after backup work to catch another tab's intervening write.
      if (storage.getItem(profile.key) !== expected) throw new GardenStoreError('conflict', 'This garden changed in another tab. Retry to load the latest progress.');
      storage.setItem(profile.key, raw);
      if (storage.getItem(profile.key) !== raw) throw new GardenStoreError('write', 'Save could not be verified. Reload before continuing.');
      expected = raw;
    } catch (error) {
      if (error instanceof GardenStoreError) throw error;
      throw new GardenStoreError('storage', 'Saving is unavailable. No change was applied to the screen. Export your data or retry.');
    }
    return state;
  }
  async function commitAsync(state, locks = globalThis.navigator?.locks) {
    // localStorage has no compare-and-swap. Serialize cooperating app tabs.
    if (!locks?.request) throw new GardenStoreError('locking', 'This browser cannot safely coordinate saved gardens. Export is available; changes are paused.');
    return locks.request(`garden-write:${profile.key}`, () => commit(state));
  }
  return { load, commit, commitAsync, key: profile.key };
}

export function browserStorage() {
  try { return window.localStorage; } catch {
    return { getItem() { throw new Error('Storage blocked'); }, setItem() { throw new Error('Storage blocked'); } };
  }
}

export function exportGardens(storage) {
  return { format: 'productivity-garden-backup', version: 1, exportedAt: new Date().toISOString(),
    profiles: PROFILES.map(({ id, key }) => ({ id, key, raw: storage.getItem(key),
      backupRaw: storage.getItem(backupKey({ key })) })) };
}
