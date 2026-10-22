import test from 'node:test';
import assert from 'node:assert/strict';
import { revealFrames } from '../src/game/reveal.js';

const fixed = values => { let i = 0; return () => values[i++ % values.length]; };

test('reveal frames stay in the tier and always land on the saved result', () => {
  for (const [tier, finalId] of [['basic', 'b4'], ['rare', 'r3'], ['extinct', 'e1']]) {
    const frames = revealFrames(tier, finalId, fixed([0.9, 0.1, 0.5, 0.3]));
    assert.equal(frames.length, 12);
    assert.ok(frames.every(f => f.id[0] === finalId[0]));
    assert.equal(frames.at(-1).id, finalId);
  }
});

test('reveal slows down towards the end and stays short', () => {
  const frames = revealFrames('rare', 'r2', () => 0);
  const delays = frames.slice(0, -1).map(f => f.delay);
  assert.ok(delays.at(-1) > delays[0]);
  assert.ok(delays.reduce((a, b) => a + b, 0) < 2500, 'total reveal under 2.5 s');
});
