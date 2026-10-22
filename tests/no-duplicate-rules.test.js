import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

test('both entries depend on shared game algorithms rather than local reward math', () => {
  for (const path of ['app.js', 'src/game/reducer.js', 'src/game/rules.js']) {
    const source = readFileSync(new URL('../' + path, import.meta.url), 'utf8');
    assert.match(source, /shared\/game\//, path);
    assert.doesNotMatch(source, /r\s*<\s*\.?[257]\d*|Math\.floor\([^\n]*\/(?:300000|30000)/, path);
  }
  const adapter = readFileSync(new URL('../src/game/reducer.js', import.meta.url), 'utf8');
  assert.doesNotMatch(adapter, /case\s+['"](?:PLANT|COMPLETE)['"]/, 'React must not keep its own transition engine');
});

test('React UI and meaningful step cannot roll rewards or implement game transitions', () => {
  const paths = readdirSync(new URL('../src/components/', import.meta.url)).filter(p => p.endsWith('.jsx'));
  for (const path of paths) {
    const source = readFileSync(new URL('../src/components/' + path, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /Math\.random|rollWeighted|REWARDS\s*=|case\s+['"](?:PLANT|COMPLETE)['"]/, path);
  }
  const model = readFileSync(new URL('../shared/meaningfulStep/model.js', import.meta.url), 'utf8');
  assert.doesNotMatch(model, /from\s+['"][^'"]*game\//);
});
