import assert from "node:assert/strict";
import { createElement as h, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const { Breadcrumbs } = await server.ssrLoadModule("/src/ohmygui/navigation/Breadcrumbs.tsx");
  const { NavigationStack } = await server.ssrLoadModule("/src/ohmygui/navigation/NavigationStack.tsx");
  const item = (label, props) => h(Breadcrumbs.Item, props, label);
  const render = (props, ...children) => renderToStaticMarkup(h(Breadcrumbs, props, ...children));
  const html = render({ maxItems: 4, "aria-label": "Location", classNames: { link: "shared-link" } },
    item("Home", { href: "/", className: "custom-link", title: "Go home" }),
    h(Fragment, null, item(h("strong", null, "Section"), { href: "/section" }), false,
      item("Disabled", { href: "/disabled", disabled: true })),
    item("Components", { href: "/components" }),
    item("Current", { href: "/current" }));
  assert.match(html, /<nav[^>]*aria-label="Location"/);
  assert.match(html, /<details/);
  assert.match(html, /<summary[^>]*aria-label="Show ancestor pages"/);
  assert.equal((html.match(/<li\b/g) ?? []).length, 6, "Collapsed ancestors remain in the disclosure");
  assert.match(html, /<strong>Section<\/strong>/, "Rich children survive composition");
  assert.match(html, /class="shared-link custom-link"/, "Item and parent classes combine");
  assert.match(html, /title="Go home"/, "Native anchor attributes survive");
  const disabled = html.match(/<a\b[^>]*>Disabled<\/a>/)?.[0];
  assert.ok(disabled);
  assert.match(disabled, /aria-disabled="true"/);
  assert.match(disabled, /tabindex="-1"/);
  assert.doesNotMatch(disabled, /href=/);
  assert.match(html, /<span[^>]*aria-current="page"[^>]*>Current<\/span>/);
  assert.doesNotMatch(html, /href="\/current"/);
  assert.doesNotMatch(render({}, item("Only", { href: "/only" })), /<a\b|<details/);
  assert.doesNotThrow(() => render({}, null, false));
  assert.throws(() => render({}, h("div", null, "Invalid")), /Breadcrumbs.Item/);
  assert.doesNotMatch(render({ maxItems: Infinity }, ...Array.from({ length: 6 }, (_, i) => item(String(i), { href: `/${i}` }))), /<details/);
  const stack = renderToStaticMarkup(h(NavigationStack, { breadcrumbs: [{ label: "Home", href: "/" }, { label: "Leaf" }] }));
  assert.match(stack, /href="\/"/);
  assert.match(stack, /aria-current="page"[^>]*>Leaf/);
  console.log("PASS Breadcrumbs SSR: compound items, fragments, rich content, overflow, disabled/current semantics, native attributes and NavigationStack compatibility");
} finally {
  await server.close();
}
