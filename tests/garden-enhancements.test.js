import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, transition } from '../shared/game/transitions.js';
import { REACT } from '../shared/game/profiles.js';
import { growthProgress } from '../shared/game/rules.js';
import { validateGarden } from '../shared/persistence/gardenStores.js';

test('archive and restore preserve plants, bank and collection without more rewards', () => {
  let s = transition(createInitialState(), {type:'PLANT',slot:0,title:'Flutter',x:50,y:50,now:0});
  s = transition(s, {type:'PLANT',slot:1,title:'Draw',x:30,y:30,now:10});
  s = transition(s, {type:'COMPLETE',id:1}, REACT, () => 0);
  const bank = structuredClone(s.bank), counts = structuredClone(s.matured);
  const archived = transition(s, {type:'ARCHIVE_COMPLETED'});
  assert.equal(archived.plants.length, 2);
  assert.equal(archived.plants[0].archived, true);
  assert.equal(archived.plants[1].archived, undefined);
  assert.deepEqual(archived.bank, bank);
  assert.deepEqual(archived.matured, counts);
  assert.equal(transition(archived, {type:'COMPLETE',id:1}), archived);
  assert.equal(transition(archived, {type:'ARCHIVE_COMPLETED'}), archived);
  const restored = transition(archived, {type:'RESTORE_ARCHIVED'});
  assert.equal(restored.plants[0].archived, false);
  assert.deepEqual(restored.matured, counts);
  assert.ok(validateGarden(restored, REACT));
});

test('rename preserves identity and rejects empty or oversized input', () => {
  const s = transition(createInitialState(), {type:'PLANT',slot:0,title:'Flutter',x:50,y:50,now:100});
  const next = transition(s,{type:'RENAME',id:1,title:'  Open project  '});
  assert.deepEqual(next.plants[0], {...s.plants[0],title:'Open project'});
  assert.equal(transition(s,{type:'RENAME',id:1,title:' '}), s);
  assert.equal(transition(s,{type:'RENAME',id:1,title:'x'.repeat(121)}), s);
  assert.equal(transition(s,{type:'RENAME',id:9,title:'Unknown'}), s);
});

test('visual growth handles stage boundaries and future clock without gating completion', () => {
  assert.deepEqual(growthProgress(100,0,REACT),{stage:1,remainingMs:30000,fraction:0});
  assert.equal(growthProgress(0,29999,REACT).stage,1);
  assert.equal(growthProgress(0,30000,REACT).stage,2);
  assert.equal(growthProgress(0,120000,REACT).remainingMs,0);
  assert.equal(growthProgress(0,999999,REACT).fraction,1);
});
