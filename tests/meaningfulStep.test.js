import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyStep, validateStep, stepTransition, resolveStep } from '../shared/meaningfulStep/model.js';
import { KEY, IDENTITY_BACKUP_KEY, createMeaningfulStepStore, exportMeaningfulStep } from '../shared/persistence/meaningfulStepStore.js';
const locks = { request: async (_key, fn) => fn() };
const chosen = () => stepTransition(emptyStep(), { type: 'CHOOSE', entry: 'react', taskId: 1, taskCreatedAt: 50, now: 100 });
function memory(initial = {}) {
  const map = new Map(Object.entries(initial));
  return { map, getItem: key => map.get(key) ?? null, setItem: (key, raw) => map.set(key, raw), removeItem: key => map.delete(key) };
}
test('entry namespaces and ID types are distinct', () => {
  assert.equal(validateStep(chosen()), true);
  assert.equal(validateStep({ ...chosen(), active: { ...chosen().active, taskId: '1' } }), false);
  assert.equal(resolveStep(chosen(), 'standalone', [{ id: 1, done: false }]), null);
  assert.equal(resolveStep(chosen(), 'react', [{ id: '1', matureId: null, plantedAt: 50 }]), null);
});
test('same target preserves edits and start; replacement resets them', () => {
  let s = stepTransition(chosen(), { type: 'EDIT', text: 'Open Flutter' });
  s = stepTransition(s, { type: 'START', now: 200 });
  assert.equal(stepTransition(s, { type: 'CHOOSE', entry: 'react', taskId: 1, taskCreatedAt: 50, now: 300 }), s);
  assert.deepEqual(stepTransition(s, { type: 'CHOOSE', entry: 'react', taskId: 2, taskCreatedAt: 60, now: 300 }).active,
    { entry: 'react', taskId: 2, taskCreatedAt: 60, step: '', selectedAt: 300, startedAt: null });
});
test('start is idempotent and day rollover never resets a selection', () => {
  const s = stepTransition(chosen(), { type: 'START', now: 200 });
  assert.equal(stepTransition(s, { type: 'START', now: 86400200 }), s);
  assert.equal(stepTransition(s, { type: 'CHOOSE', entry: 'react', taskId: 1, taskCreatedAt: 50, now: 86400200 }), s);
});
test('optional step has a 240 character limit and transitions are pure', () => {
  const s = chosen();
  assert.equal(stepTransition(s, { type: 'EDIT' }).active.step, '');
  assert.throws(() => stepTransition(s, { type: 'EDIT', text: 'a'.repeat(241) }));
  assert.equal(s.active.step, '');
});
test('resolution excludes completed plants; clearing leaves game data untouched', () => {
  const plants = [{ id: 1, matureId: null, plantedAt: 50 }];
  const before = JSON.stringify(plants);
  assert.equal(resolveStep(chosen(), 'react', plants), plants[0]);
  assert.equal(resolveStep(chosen(), 'react', [{ id: 1, matureId: 'b1', plantedAt: 50 }]), null);
  const standalone = stepTransition(emptyStep(), { type: 'CHOOSE', entry: 'standalone', taskId: 'a', taskCreatedAt: 50, now: 0 });
  assert.equal(resolveStep(standalone, 'standalone', [{ id: 'a', done: true }]), null);
  assert.deepEqual(stepTransition(chosen(), { type: 'CLEAR' }), emptyStep());
  assert.equal(JSON.stringify(plants), before);
});
test('loading is read only and a successful save survives reload', async () => {
  const storage = memory(); const store = createMeaningfulStepStore(storage);
  assert.deepEqual(store.load().state, emptyStep());
  assert.equal(storage.map.size, 0);
  await store.commitAsync(chosen(), locks);
  assert.deepEqual(createMeaningfulStepStore(storage).load().state, chosen());
});
test('malformed JSON and invalid schema cannot be overwritten', async () => {
  for (const raw of ['{', '{"schemaVersion":2,"active":null}']) {
    const storage = memory({ [KEY]: raw }); const store = createMeaningfulStepStore(storage);
    assert.equal(store.load().error.code, 'invalid');
    await assert.rejects(store.commitAsync(chosen(), locks), { code: 'readonly' });
    assert.equal(storage.getItem(KEY), raw);
    assert.equal(exportMeaningfulStep(storage).raw, raw);
  }
});
test('quota error preserves previous saved state', async () => {
  const storage = memory(); const store = createMeaningfulStepStore(storage); store.load();
  storage.setItem = () => { throw new Error('QuotaExceededError'); };
  await assert.rejects(store.commitAsync(chosen(), locks), { code: 'storage' });
  assert.equal(storage.getItem(KEY), null);
});
test('stale tabs cannot overwrite or clear another tab', async () => {
  const storage = memory(); const a = createMeaningfulStepStore(storage); const b = createMeaningfulStepStore(storage);
  a.load(); b.load(); await a.commitAsync(chosen(), locks);
  await assert.rejects(b.commitAsync(emptyStep(), locks), { code: 'conflict' });
  await assert.rejects(b.clearAsync(locks), { code: 'conflict' });
});
test('explicit clear removes only feature data, including invalid data', async () => {
  const storage = memory({ [KEY]: '{', garden: 'original', backup: 'original' });
  const store = createMeaningfulStepStore(storage); store.load(); await store.clearAsync(locks);
  assert.equal(storage.getItem(KEY), null);
  assert.equal(storage.getItem('garden'), 'original'); assert.equal(storage.getItem('backup'), 'original');
});
test('writes and clear require load and browser locking', async () => {
  const store = createMeaningfulStepStore(memory());
  await assert.rejects(store.clearAsync(locks), { code: 'readonly' });
  store.load(); await assert.rejects(store.commitAsync(chosen(), {}), { code: 'locking' });
  await assert.rejects(store.commitAsync(chosen(), { request: async () => { throw new Error('refused'); } }), { code: 'locking' });
});
test('readback failures are surfaced', async () => {
  const storage = memory(); const store = createMeaningfulStepStore(storage); store.load();
  storage.setItem = () => {};
  await assert.rejects(store.commitAsync(chosen(), locks), { code: 'write' });
});


test('blank steps normalize to empty and reused task ids cannot attach a selection', () => {
  const s=stepTransition(chosen(),{type:'EDIT',text:'   \n  '});
  assert.equal(s.active.step,'');
  assert.equal(resolveStep(s,'react',[{id:1,plantedAt:51,matureId:null}]),null);
  const legacy=structuredClone(s);delete legacy.active.taskCreatedAt;
  assert.equal(validateStep(legacy),true);
  assert.equal(resolveStep(legacy,'react',[{id:1,plantedAt:50,matureId:null}]),null);
  const selected=stepTransition(legacy,{type:'CHOOSE',entry:'react',taskId:1,taskCreatedAt:51,now:1000});
  assert.equal(selected.active.startedAt,null);
  assert.equal(selected.active.taskCreatedAt,51);
});

test('legacy selection is snapshotted before explicit reselection and exported without data loss', async () => {
  const legacy=chosen();delete legacy.active.taskCreatedAt;legacy.active.step='old first step';
  const raw=JSON.stringify(legacy,null,2),storage=memory({[KEY]:raw,'productivity-garden:v2':'untouched'});
  const store=createMeaningfulStepStore(storage);store.load();
  const next=stepTransition(legacy,{type:'CHOOSE',entry:'react',taskId:1,taskCreatedAt:70,now:200});
  await store.commitAsync(next,locks);
  assert.equal(storage.getItem(IDENTITY_BACKUP_KEY),raw);
  assert.equal(exportMeaningfulStep(storage).identityBackupRaw,raw);
  assert.equal(storage.getItem('productivity-garden:v2'),'untouched');
  await store.clearAsync(locks);
  assert.equal(storage.getItem(KEY),null);assert.equal(storage.getItem(IDENTITY_BACKUP_KEY),null);
  assert.equal(storage.getItem('productivity-garden:v2'),'untouched');
});

test('failed identity snapshot leaves the legacy selection unchanged',async()=>{
  const legacy=chosen();delete legacy.active.taskCreatedAt;const raw=JSON.stringify(legacy);
  const storage=memory({[KEY]:raw});const set=storage.setItem;
  storage.setItem=(key,value)=>{if(key!==IDENTITY_BACKUP_KEY)set(key,value)};
  const store=createMeaningfulStepStore(storage);store.load();
  await assert.rejects(store.commitAsync(chosen(),locks),{code:'write'});
  assert.equal(storage.getItem(KEY),raw);
});
