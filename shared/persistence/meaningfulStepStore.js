import { emptyStep, validateStep } from '../meaningfulStep/model.js';

export const KEY = 'personal-growth-garden:meaningful-step:v1';
export const IDENTITY_BACKUP_KEY = `${KEY}:backup:before-task-identity`;
export class MeaningfulStepStoreError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
const fail = (code, message) => { throw new MeaningfulStepStoreError(code, message); };
export function createMeaningfulStepStore(storage) {
  let expected, loaded = false, blocked = false;
  function load() {
    loaded = false;
    try {
      expected = storage.getItem(KEY);
      loaded = true;
      const state = expected === null ? emptyStep() : JSON.parse(expected);
      if (!validateStep(state)) throw new Error('Invalid state');
      blocked = false;
      return { state, error: null };
    } catch {
      blocked = true;
      return { state: emptyStep(), error: new MeaningfulStepStoreError('invalid', 'Saved step could not be read; the original is preserved.') };
    }
  }
  function write(state, clear) {
    if (!loaded || (blocked && !clear)) fail('readonly', 'Reload or export saved step before continuing.');
    if (!clear && !validateStep(state)) fail('invalid', 'Invalid step; nothing was saved.');
    try {
      if (storage.getItem(KEY) !== expected) fail('conflict', 'The step changed in another tab. Reload before continuing.');
      const raw = clear ? null : JSON.stringify(state);
      if (clear) {
        storage.removeItem(KEY);
        storage.removeItem(IDENTITY_BACKUP_KEY);
        if(storage.getItem(IDENTITY_BACKUP_KEY)!==null)fail('write','Selection backup deletion could not be verified.');
      } else {
        const previous=expected===null ? null : JSON.parse(expected);
        if(previous?.active && previous.active.taskCreatedAt===undefined) {
          if(storage.getItem(IDENTITY_BACKUP_KEY)===null){
            storage.setItem(IDENTITY_BACKUP_KEY,expected);
            if(storage.getItem(IDENTITY_BACKUP_KEY)!==expected)fail('write','Original selection backup could not be verified.');
          }
          const backup=storage.getItem(IDENTITY_BACKUP_KEY);
          if(backup===null||!validateStep(JSON.parse(backup)))fail('write','Original selection backup could not be verified.');
          // Only the first historical selection is snapshotted, like the garden backup.
          if(storage.getItem(KEY)!==expected)fail('conflict','The step changed in another tab.');
        }
        storage.setItem(KEY, raw);
      }
      if (storage.getItem(KEY) !== raw) fail('write', 'Save could not be verified. Reload before continuing.');
      expected = raw;
      blocked = false;
      return clear ? emptyStep() : state;
    } catch (error) {
      if (error instanceof MeaningfulStepStoreError) throw error;
      fail('storage', 'Storage is unavailable; the screen must keep its previous state.');
    }
  }
  async function locked(state, clear, locks) {
    if (!locks?.request) fail('locking', 'This browser cannot safely coordinate saved steps.');
    try { return await locks.request(`garden-write:${KEY}`, () => write(state, clear)); }
    catch (error) {
      if (error instanceof MeaningfulStepStoreError) throw error;
      fail('locking', 'The save lock was unavailable.');
    }
  }
  return { key: KEY, load,
    commitAsync: (state, locks = globalThis.navigator?.locks) => locked(state, false, locks),
    // Call only after an explicit user confirmation, including unreadable data.
    clearAsync: (locks = globalThis.navigator?.locks) => locked(null, true, locks) };
}
export function exportMeaningfulStep(storage) {
  return { format: 'productivity-garden-meaningful-step-backup', version: 1,
    exportedAt: new Date().toISOString(), key: KEY, raw: storage.getItem(KEY),
    identityBackupRaw:storage.getItem(IDENTITY_BACKUP_KEY) };
}
