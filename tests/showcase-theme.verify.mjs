import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const output = existsSync('dist/client/index.html') ? 'dist/client' : 'dist';
const base = output + '/ohmygui';
const paths = [base + '/index.html', ...readdirSync(base, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => base + '/' + entry.name + '/index.html')];
let bootstrap;
for (const path of paths) {
  const html = readFileSync(path, 'utf8');
  const script = /<script\b(?=[^>]*data-ohmygui-preferences)[^>]*>([\s\S]*?)<\/script>/.exec(html);
  assert(script, path + ': preference bootstrap is present');
  const root = /<div\b[^>]*data-showcase-route="[^"]*"[^>]*>/.exec(html);
  assert(root, path + ': SSR shell is present');
  assert(script.index < root.index, path + ': preferences apply before shell markup is parsed');
  assert.doesNotMatch(root[0], /\bdata-(?:theme|ui-theme|ui-density)=/, path + ': SSR root does not override inherited saved preferences');
  assert.doesNotMatch(root[0], /\bclass="[^"]*\b(?:dark|light)\b/, path + ': hydration starts without a conflicting local theme');
  assert.doesNotMatch(root[0], /hidden|visibility:\s*hidden|opacity:\s*0/, path + ': content stays visible without hydration');
  bootstrap ??= script[1];
  assert.equal(script[1], bootstrap, path + ': bootstrap behavior is shared across destinations');
}
for (const [storedTheme, storedDensity, blocked, expectedTheme, expectedDensity] of [
  ['dark', 'compact', false, 'dark', 'compact'],
  ['dark', 'comfortable', false, 'dark', 'comfortable'],
  ['light', 'compact', false, 'light', 'compact'],
  [null, null, false, 'light', 'comfortable'],
  ['invalid', 'invalid', false, 'light', 'comfortable'],
  [null, null, true, 'light', 'comfortable'],
]) {
  const classes = new Set(['dark', 'unrelated']);
  const root = { dataset: { uiTheme: 'studio' }, classList: { toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); } } };
  const storage = { getItem(key) { if (blocked) throw new Error('Storage blocked'); return key === 'ohmygui-showcase-theme' ? storedTheme : storedDensity; }, setItem() { throw new Error('Bootstrap must not overwrite stored preferences'); } };
  runInNewContext(bootstrap, { document: { documentElement: root }, localStorage: storage }, { timeout: 1000 });
  assert.equal(root.dataset.theme, expectedTheme);
  assert.equal(root.dataset.ohmyguiTheme, expectedTheme);
  assert.equal(root.dataset.uiDensity, expectedDensity);
  assert.equal(root.dataset.uiTheme, expectedTheme === 'light' ? 'studio' : undefined);
  assert.equal(classes.has('dark'), expectedTheme === 'dark');
  assert.equal(classes.has('light'), expectedTheme === 'light');
  assert(classes.has('unrelated'), 'Unrelated document classes remain');
}
console.log(`PASS prepaint preferences on ${paths.length} showcase pages: bootstrap ordering, hydration-safe inherited theme, visible SSR, saved theme/density, invalid values and blocked storage.`);
