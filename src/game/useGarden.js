import { useEffect, useRef, useState } from 'react';
import { gardenReducer } from './reducer.js';
import { createInitialState } from './rules.js';
import { REACT } from '../../shared/game/profiles.js';
import { browserStorage, createGardenStore, exportGardens } from '../../shared/persistence/gardenStores.js';
import { downloadBackup } from '../../ui/backup.js';

export function useGarden() {
  const session = useRef(null);
  if (!session.current) {
    const store = createGardenStore(browserStorage(), REACT);
    const loaded = store.load(createInitialState);
    session.current = { store, state: loaded.state, error: loaded.error, saving: false };
  }
  const live = session.current;
  const [state, setState] = useState(live.state);
  const [error, setError] = useState(live.error);
  const [saving, setSaving] = useState(false);
  function fail(value) { live.error = value; setError(value); }
  async function dispatch(action) {
    if (live.error || live.saving) return null;
    live.saving = true; setSaving(true);
    try {
      const next = gardenReducer(live.state, action);
      if (next === live.state) return null;
      await live.store.commitAsync(next);
      live.state = next; setState(next);
      return next;
    } catch (value) { fail(value); return null; }
    finally { live.saving = false; setSaving(false); }
  }
  function retry() {
    if (live.saving) return;
    const loaded = live.store.load(createInitialState);
    live.state = loaded.state; setState(loaded.state); fail(loaded.error);
  }
  function exportData() {
    try { downloadBackup(exportGardens(browserStorage())); }
    catch { fail(new Error('Saved data could not be read for export.')); }
  }
  useEffect(() => {
    const changed = event => {
      if (event.key === REACT.key || event.key === null) {
        // Valid external saves can refresh without obstructing the independent Start action.
        // During an in-flight mutation, keep the old expected version so CAS rejects it.
        if (live.saving) fail(new Error('This garden changed in another tab. Retry loading to continue.'));
        else retry();
      }
    };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, []);
  return [state, dispatch, { error, retry, exportData, saving }];
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
}
