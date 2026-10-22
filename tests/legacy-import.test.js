import test from 'node:test';
import assert from 'node:assert/strict';
import { importLegacy, claimLegacySeeds } from '../shared/game/legacyImport.js';
import { createInitialState, transition } from '../shared/game/transitions.js';
import { validateGarden } from '../shared/persistence/gardenStores.js';
import { REACT } from '../shared/game/profiles.js';
const legacy=()=>({seeds:['sunwhisper',null,'moonlily',null,'dragonroot'],garden:[
  {id:'old-a',seed:'sunwhisper',title:'Old task',x:20,y:40,created:1,done:false},
  {id:'old-b',seed:'moonlily',title:'Completed old task',x:60,y:60,created:2,done:true},
],counts:{moonlily:2}});
test('explicit legacy copy preserves both gardens and counts, with overflow seeds retained',()=>{
  const current=transition(createInitialState(),{type:'PLANT',slot:0,title:'Current',x:50,y:50,now:3});
  const source=JSON.stringify(legacy()), before=structuredClone(current);
  const next=importLegacy(current,source);
  assert.deepEqual(current,before); assert.equal(JSON.stringify(legacy()),source);
  assert.equal(next.plants.length,3); assert.equal(new Set(next.plants.map(p=>p.id)).size,3);
  assert.equal(next.plants[1].title,'Old task'); assert.equal(next.plants[2].matureId,'r1');
  assert.equal(next.matured.r1,2); assert.deepEqual(next.legacySeedReserve,['rare','extinct']);
  assert.ok(validateGarden(next,REACT)); assert.equal(importLegacy(next,source),next);
});
test('legacy species survives completion and reserve is claimed only into free slots',()=>{
  const next=importLegacy(createInitialState(),JSON.stringify(legacy()));
  const done=transition(next,{type:'COMPLETE',id:1},REACT,()=>0.99);
  assert.equal(done.plants[0].matureId,'b1');
  assert.equal(claimLegacySeeds(done),done);
  const free={...done,bank:[null,...done.bank.slice(1)]};
  const claimed=claimLegacySeeds(free);
  assert.equal(claimed.bank[0],'basic'); assert.equal(claimed.legacySeedReserve.length,2);
  assert.deepEqual(claimed.matured,done.matured);
});
test('invalid legacy data is rejected and restart cannot duplicate imported collection',()=>{
  const state=createInitialState(); assert.throws(()=>importLegacy(state,'bad'));
  assert.throws(()=>importLegacy(state,JSON.stringify({...legacy(),seeds:['unknown']})));
  const imported=importLegacy(state,JSON.stringify(legacy()));
  const restart=transition(imported,{type:'RESTART'});
  assert.equal(importLegacy(restart,JSON.stringify(legacy())),restart);
  assert.deepEqual(restart.matured,imported.matured);
  assert.equal(validateGarden({...imported,legacySeedReserve:['unknown']},REACT),false);
  assert.equal(validateGarden({...imported,legacyImported:'yes'},REACT),false);
  assert.equal(validateGarden({...imported,plants:imported.plants.map(p=>({...p,legacySpecies:'e9'}))},REACT),false);
});
