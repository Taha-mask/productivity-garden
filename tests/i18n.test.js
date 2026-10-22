import test from 'node:test';
import assert from 'node:assert/strict';
import { messages } from '../src/i18n/messages.js';
import { arabicLore } from '../src/i18n/plantLore.js';
import { CATALOGUE } from '../src/data/catalogue.js';

test('both UI languages cover the same messages, including errors and privacy', () => {
  const english = messages('en'), arabic = messages('ar');
  assert.deepEqual(Object.keys(arabic).sort(), Object.keys(english).sort());
  for (const value of [...Object.values(english), ...Object.values(arabic)]) assert.ok(typeof value === 'string' && value.trim());
  for (const plant of CATALOGUE) assert.equal(arabicLore[plant.id].length, 2);
});
