import { useEffect, useRef, useState } from 'react';
import { stepTransition, resolveStep } from '../../shared/meaningfulStep/model.js';
import { createMeaningfulStepStore, KEY } from '../../shared/persistence/meaningfulStepStore.js';
import { browserStorage } from '../../shared/persistence/gardenStores.js';

export function useMeaningfulStep(plants) {
  const ref = useRef(null);
  if (!ref.current) {
    const store = createMeaningfulStepStore(browserStorage()), loaded = store.load();
    ref.current = { store, state: loaded.state, error: loaded.error, busy: false };
  }
  const live = ref.current;
  const [state, setState] = useState(live.state), [error, setError] = useState(live.error), [busy, setBusy] = useState(false);
  function fail(value) { live.error = value; setError(value); }
  async function apply(action, erase = false) {
    if (live.busy || (live.error && !erase)) return false;
    live.busy = true; setBusy(true);
    try {
      const next = erase ? await live.store.clearAsync()
        : await live.store.commitAsync(stepTransition(live.state, action));
      live.state = next; setState(next); fail(null); return true;
    } catch (value) { fail(value); return false; }
    finally { live.busy = false; setBusy(false); }
  }
  function retry() {
    if (live.busy) return;
    const loaded = live.store.load(); live.state = loaded.state; setState(loaded.state); fail(loaded.error);
  }
  useEffect(() => {
    const changed = event => { if (event.key === KEY || event.key === null) fail(new Error('Selection changed in another tab. Reload it before saving.')); };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, []);
  const task = resolveStep(state, 'react', plants);
  return { state, task, error, busy, retry,
    choose: (id, newlySavedPlant) => {
      // A garden save can resolve before React rerenders the plants prop.
      const plant=newlySavedPlant?.id===id&&!newlySavedPlant.matureId ? newlySavedPlant : plants.find(p=>p.id===id&&!p.matureId);
      return plant ? apply({ type: 'CHOOSE', entry: 'react', taskId: id, taskCreatedAt: plant.plantedAt, now: Date.now() }) : Promise.resolve(false);
    },
    edit: text => apply({ type: 'EDIT', text }),
    start: () => task ? apply({ type: 'START', now: Date.now() }) : Promise.resolve(false),
    clear: () => apply({ type: 'CLEAR' }), erase: () => apply(null, true) };
}
