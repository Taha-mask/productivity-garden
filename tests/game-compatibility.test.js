import test from 'node:test';
import assert from 'node:assert/strict';
import { STANDALONE, REACT } from '../shared/game/profiles.js';
import { createInitialState, transition } from '../shared/game/transitions.js';
import { stageAt, rollRewardSeed, pickSpecies } from '../shared/game/rules.js';
import * as old from './fixtures/legacy-rules.js';

const sequence = values => { let index = 0; return () => { assert.ok(index < values.length, 'unexpected random draw'); return values[index++]; }; };
const samples = [0, .249999, .25, .499999, .5, .749999, .75, .999999];

test('initial states retain distinct bank representations and random draw behavior', () => {
  assert.deepEqual(createInitialState(STANDALONE, sequence([0,.2,.4,.6,.8]), old.standaloneCatalogue), old.initialStandalone(sequence([0,.2,.4,.6,.8])));
  assert.deepEqual(createInitialState(REACT, sequence([])), old.initialReact());
});

for (const [name, profile, catalogue, oracle, initial, bankKey, plantsKey] of [
  ['standalone', STANDALONE, old.standaloneCatalogue, old.standalone, () => old.initialStandalone(() => 0), 'seeds', 'garden'],
  ['react', REACT, old.reactCatalogue, old.react, old.initialReact, 'bank', 'plants'],
]) {
  test(`${name}: historical reward boundaries for every tier`, () => {
    for (const tier of ['basic','rare','extinct']) for (const draw of samples) {
      assert.equal(rollRewardSeed(tier, profile, () => draw), (name === 'react' ? old.rewardReact : old.rewardStandalone)(tier, () => draw));
    }
  });
  test(`${name}: species selection preserves catalogue order`, () => {
    for (const tier of ['basic','rare','extinct']) for (let i=0;i<5;i++) {
      assert.equal(pickSpecies(tier, catalogue, () => (i+.1)/5), catalogue.filter(p => p.tier===tier)[i].id);
    }
  });
  test(`${name}: plant/complete replay preserves positions, timestamps, counters and RNG ordering`, () => {
    let actual = initial(), expected = initial();
    const replay = action => {
      const before = structuredClone(actual);
      expected = oracle(expected, action, sequence([.85,.1]));
      const input = actual;
      actual = transition(actual, action, profile, sequence([.85,.1]), catalogue);
      assert.deepEqual(input, before, 'transition must not mutate its input');
      assert.deepEqual(actual, expected);
    };
    replay({type:'PLANT', slot:0, title:'  Flutter widget  ', x:23.75, y:81.25, now:123456, id:'fixed-plant'});
    const id = actual[plantsKey][0].id;
    replay({type:'PLANT', slot:0, title:'Cannot spend the same seed', now:999, id:'bad'});
    replay({type:'PLANT', slot:1, title:'   ', now:999, id:'blank'});
    replay({type:'COMPLETE', id:'missing'});
    replay({type:'COMPLETE', id});
    assert.equal(actual[bankKey].filter(Boolean).length, 5);
    replay({type:'COMPLETE', id});
    replay({type:'UNKNOWN'});
    if (name === 'react') { replay({type:'UPROOT', id}); replay({type:'RESTART'}); }
  });
  test(`${name}: completion with full bank follows its historical behavior`, () => {
    let state = oracle(initial(), {type:'PLANT',slot:0,title:'Existing task',x:10,y:20,now:1,id:'full-bank'}, () => 0);
    state[bankKey][0] = name === 'react' ? 'basic' : 'sunwhisper';
    const action = {type:'COMPLETE', id:state[plantsKey][0].id};
    assert.deepEqual(transition(state, action, profile, sequence([.85,.1]), catalogue), oracle(state, action, sequence([.85,.1])));
  });
}

test('growth timing remains five minutes standalone and thirty seconds React', () => {
  for (const [profile, interval] of [[STANDALONE,300000],[REACT,30000]]) {
    for (const elapsed of [0,interval-1,interval,interval*2,interval*4,interval*100]) {
      assert.equal(stageAt(1000,1000+elapsed,profile), Math.min(5,1+Math.floor(elapsed/interval)));
    }
  }
});

test('standalone: unknown saved metadata survives plant and completion', () => {
  let state = {...old.initialStandalone(() => 0), futureSetting:{enabled:true}};
  state = old.standalone(state,{type:'PLANT',slot:0,title:'Saved task',x:11,y:22,now:33,id:'saved'},() => 0);
  state.garden[0].customNote = {text:'Keep this annotation'};
  const before = structuredClone(state), action = {type:'COMPLETE',id:'saved'};
  assert.deepEqual(transition(state,action,STANDALONE,sequence([.9,.2]),old.standaloneCatalogue),old.standalone(state,action,sequence([.9,.2])));
  assert.deepEqual(state,before);
});

test('future timestamps keep legacy growth handling per entry', () => {
  assert.equal(stageAt(300000,0,STANDALONE),0);
  assert.equal(stageAt(300000,0,REACT),1);
});
