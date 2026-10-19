import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, resolve: { alias: { '@': process.cwd() + '/src' } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: 'custom' });
try {
  const { showcaseDestination, loadShowcaseView } = await server.ssrLoadModule('/src/pages/ohmygui/_components/catalog/useShowcaseNavigation.ts');
  const origin = 'https://portfolio.example';
  const resolve = path => showcaseDestination(new URL(path, origin), origin);
  assert.equal(resolve('/ohmygui').entry, null);
  assert.equal(resolve('/ohmygui/').entry, null);
  assert.equal(resolve('/ohmygui/examples/').examples, true);
  assert.equal(resolve('/ohmygui/examples/').entry, null);
  assert.equal(resolve('/ohmygui/button/').examples, false);
  assert.equal(resolve('/ohmygui').examples, false);
  assert.equal(resolve('/ohmygui/examples/not-real'), null);
  assert.equal(resolve('/ohmygui/button/').entry.name, 'Button');
  assert.equal(resolve('/ohmygui#input').hash, '#input');
  assert.equal(resolve('/ohmygui/button?demo=1#preview').href, '/ohmygui/button?demo=1#preview');
  for (const path of ['/blog/example', '/ohmygui/not-real', '/ohmygui/button/extra', '/ohmygui/%62utton', 'https://elsewhere.example/ohmygui/button', 'javascript:alert(1)']) assert.equal(resolve(path), null, path);
  const view = await loadShowcaseView(resolve('/ohmygui/button').entry);
  assert.equal(typeof view.Example, 'function');
  assert.equal(view.source, readFileSync('src/pages/ohmygui/_components/catalog/examples/Button.tsx', 'utf8'));
  assert.deepEqual(await loadShowcaseView(null), { entry: null, source: '', Example: undefined });
  await assert.rejects(loadShowcaseView({ name: 'DoesNotExist', slug: 'does-not-exist', category: 'input', description: '' }), /Missing showcase example/);
  console.log('PASS showcase destinations: registered URLs, overview/fragments/query, external/unknown rejection, paired lazy module/source loading, and missing-module failure.');
} finally { await server.close(); }
