import test from 'node:test';
import assert from 'node:assert/strict';
import {STANDALONE, REACT} from '../shared/game/profiles.js';
import {createGardenStore, backupKey, exportGardens} from '../shared/persistence/gardenStores.js';
import {initialStandalone, initialReact, standaloneCatalogue, reactCatalogue} from './fixtures/legacy-rules.js';

class MemoryStorage {
  constructor(entries = []) { this.data = new Map(entries); this.writes = []; this.removals = []; }
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) {
    this.writes.push([key,value]);
    if (this.fail?.(key)) throw new Error('QuotaExceededError');
    if (!this.drop?.(key)) this.data.set(key,String(value));
  }
  removeItem(key) { this.removals.push(key); this.data.delete(key); }
}
const errorCode = code => error => error.code === code;
const setups = [
  [STANDALONE, standaloneCatalogue, () => initialStandalone(() => .4)],
  [REACT, reactCatalogue, initialReact],
];
for (const [profile,catalogue,initial] of setups) {
  const raw = JSON.stringify(initial(),null,2) + '\n';
  const make = (storage = new MemoryStorage([[profile.key,raw]])) => ({storage, store:createGardenStore(storage,profile,catalogue)});
  test(`${profile.id}: load performs zero writes and preserves exact saved bytes`, () => {
    const {storage,store} = make();
    assert.deepEqual(store.load(initial),{state:initial(),error:null});
    assert.equal(storage.getItem(profile.key),raw); assert.deepEqual(storage.writes,[]);
    assert.deepEqual(storage.removals,[]);
  });
  test(`${profile.id}: first commit snapshots exact original; later saves retain it and other namespace`, () => {
    const other = profile === STANDALONE ? REACT : STANDALONE;
    const storage = new MemoryStorage([[profile.key,raw],[other.key,'other exact bytes'],[backupKey(other),'other backup']]);
    const {store} = make(storage); store.load(initial);
    const next = {...initial(),customSetting:1}; store.commit(next);
    assert.equal(storage.getItem(backupKey(profile)),raw);
    store.commit({...next,customSetting:2});
    assert.equal(storage.getItem(backupKey(profile)),raw);
    assert.equal(storage.getItem(other.key),'other exact bytes');
    assert.equal(storage.getItem(backupKey(other)),'other backup');
    assert.deepEqual(storage.removals,[]);
  });
  test(`${profile.id}: dropped or quota-failed backup prevents primary writes`, () => {
    for (const mode of ['drop','fail']) {
      const {storage,store} = make(); store.load(initial); storage[mode] = key => key === backupKey(profile);
      assert.throws(() => store.commit({...initial(),changed:true}),errorCode(mode === 'drop' ? 'backup' : 'storage'));
      assert.equal(storage.getItem(profile.key),raw);
      assert.ok(storage.writes.every(([key]) => key !== profile.key));
    }
  });
  test(`${profile.id}: failed primary write leaves loaded state and original intact, retry succeeds`, () => {
    const {storage,store} = make(); const loaded = store.load(initial).state, before = structuredClone(loaded);
    storage.fail = key => key === profile.key;
    const next = {...loaded,changed:true};
    assert.throws(() => store.commit(next),errorCode('storage'));
    assert.deepEqual(loaded,before); assert.equal(storage.getItem(profile.key),raw);
    storage.fail = null; assert.deepEqual(store.commit(next),next);
    assert.equal(storage.getItem(backupKey(profile)),raw);
  });
  test(`${profile.id}: stale tabs cannot overwrite newer progress`, () => {
    const {storage,store} = make(), second = createGardenStore(storage,profile,catalogue);
    store.load(initial); second.load(initial);
    const newer = {...initial(),revision:1}; store.commit(newer);
    assert.throws(() => second.commit({...initial(),revision:2}),errorCode('conflict'));
    assert.equal(storage.getItem(profile.key),JSON.stringify(newer));
  });
  test(`${profile.id}: invalid JSON and unknown species are readonly and never overwritten`, () => {
    const invalid = initial();
    if (profile === STANDALONE) invalid.seeds[0] = 'unknown-species';
    else invalid.matured['unknown-species'] = 1;
    for (const bad of ['{broken',JSON.stringify(invalid)]) {
      const {storage,store} = make(new MemoryStorage([[profile.key,bad]]));
      assert.equal(store.load(initial).error.code,'invalid');
      assert.throws(() => store.commit(initial()),errorCode('readonly'));
      assert.equal(storage.getItem(profile.key),bad); assert.deepEqual(storage.writes,[]);
    }
  });
  test(`${profile.id}: absent saves load without writing; first save creates no historical snapshot`, () => {
    const {storage,store} = make(new MemoryStorage()); store.load(initial);
    assert.deepEqual(storage.writes,[]); store.commit(initial());
    assert.equal(storage.getItem(backupKey(profile)),null);
    assert.equal(storage.getItem(profile.key),JSON.stringify(initial()));
  });
  test(`${profile.id}: unreadable existing backup is retained and blocks primary replacement`, () => {
    const {storage,store} = make(new MemoryStorage([[profile.key,raw],[backupKey(profile),'{unreadable backup']]));
    store.load(initial);
    assert.throws(() => store.commit({...initial(),changed:true}),errorCode('backup'));
    assert.equal(storage.getItem(profile.key),raw);
    assert.equal(storage.getItem(backupKey(profile)),'{unreadable backup');
    assert.deepEqual(storage.writes,[]);
  });
}

test('export includes exact raw strings and both backups without mutation', () => {
  const entries = setups.flatMap(([profile]) => [[profile.key,`raw ${profile.id}\n`],[backupKey(profile),`backup ${profile.id}\n`]]);
  const storage = new MemoryStorage(entries), before = [...storage.data];
  const result = exportGardens(storage);
  assert.equal(result.version,1);
  for (const profile of result.profiles) {
    assert.equal(profile.raw,storage.getItem(profile.key));
    assert.equal(profile.backupRaw,storage.getItem(backupKey(profile)));
  }
  assert.deepEqual([...storage.data],before); assert.deepEqual(storage.writes,[]); assert.deepEqual(storage.removals,[]);
});

test('async writes use one lock namespace, serialize, and reject the stale caller', async () => {
  const storage = new MemoryStorage([[REACT.key,JSON.stringify(initialReact())]]);
  const first = createGardenStore(storage,REACT,reactCatalogue), second = createGardenStore(storage,REACT,reactCatalogue);
  first.load(initialReact); second.load(initialReact);
  let tail = Promise.resolve(), active = 0, maxActive = 0; const names = [];
  const locks = {request(name,callback) {
    names.push(name);
    const job = tail.then(async () => { active++; maxActive = Math.max(maxActive,active); try { return await callback(); } finally { active--; } });
    tail = job.catch(() => {}); return job;
  }};
  const outcomes = await Promise.allSettled([first.commitAsync({...initialReact(),revision:1},locks),second.commitAsync({...initialReact(),revision:2},locks)]);
  assert.equal(outcomes[0].status,'fulfilled'); assert.equal(outcomes[1].reason.code,'conflict');
  assert.equal(maxActive,1); assert.deepEqual(names,[`garden-write:${REACT.key}`,`garden-write:${REACT.key}`]);
  assert.equal(JSON.parse(storage.getItem(REACT.key)).revision,1);
});

test('async save refuses to write when lock coordination is unavailable', async () => {
  const storage = new MemoryStorage(), store = createGardenStore(storage,REACT,reactCatalogue); store.load(initialReact);
  await assert.rejects(store.commitAsync(initialReact(),{}),errorCode('locking'));
  assert.deepEqual(storage.writes,[]);
});
