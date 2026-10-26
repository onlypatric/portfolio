import assert from "node:assert/strict";
import { createElement as h, Fragment } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";

const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite/verify-column-browser", server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const { ColumnBrowser: Browser } = await server.ssrLoadModule("/src/ohmygui/navigation/ColumnBrowser.tsx");
  const tree = h(Fragment, null,
    h(Browser.Item, { id: "project", label: "Project" },
      h(Browser.Item, { id: "brief", label: "Brief" }, h(Browser.Item.Detail, null, h("input", { "aria-label": "Draft", defaultValue: "Keep me" }))),
      h(Browser.Item, { id: "empty", label: "Empty", branch: true })),
    h(Browser.Item, { id: "locked", label: "Locked", disabled: true }),
    h(Browser.Item, { id: "rich", textValue: "Rich label" }, h(Browser.Item.Label, null, h("strong", null, "Custom row"))));
  const html = render(h(Browser, { defaultPath: ["project", "brief"], "aria-label": "Files" }, tree));
  assert.equal((html.match(/role="listbox"/g) ?? []).length, 2);
  assert.match(html, /value="Keep me"/);
  assert.match(html, /aria-label="Brief: Details"/);
  assert.match(html, /aria-label="Rich label"/);
  assert.match(html, /<strong>Custom row<\/strong>/);
  assert.doesNotMatch(html, /\s(?:defaultPath|textValue|branch)=/);
  assert.match(html, /role="separator"/);
  const empty = render(h(Browser, { path: ["project", "empty"], emptyState: "Nothing here", resizable: false }, tree));
  assert.equal((empty.match(/role="listbox"/g) ?? []).length, 3);
  assert.match(empty, /Nothing here/); assert.doesNotMatch(empty, /role="separator"|Keep me/);
  const stale = render(h(Browser, { path: ["missing", "brief"] }, tree));
  assert.equal((stale.match(/role="listbox"/g) ?? []).length, 1);
  assert.doesNotMatch(stale, /Keep me/);
  const disabled = render(h(Browser, { path: ["locked"] }, tree));
  assert.equal((disabled.match(/role="listbox"/g) ?? []).length, 1);
  const controlled = render(h(Browser, { path: [], defaultPath: ["project", "brief"] }, tree));
  assert.doesNotMatch(controlled, /Keep me/);
  assert.throws(() => render(h(Browser, null, h(Browser.Item, { id: "same", label: "One" }), h(Browser.Item, { id: "same", label: "Two" }))), /unique among siblings/);
  assert.throws(() => render(h(Browser, null, h("div", null, "Unexpected"))), /only ColumnBrowser.Item/);
  assert.throws(() => render(h(Browser, null, h(Browser.Item, { id: "unnamed" }))), /readable label/);
  const interactive = render(h(Browser, { path: ["resource"] },
    h(Browser.Item, { id: "resource", label: "Resource", controls: h("input", { type: "checkbox", role: "switch", "aria-label": "Operate resource", defaultChecked: true }) }),
    h(Browser.Item, { id: "other", label: "Other", disabled: true, controls: h("input", { type: "checkbox" }) })));
  assert.match(interactive, /role="list"/);
  assert.equal((interactive.match(/role="listitem"/g) ?? []).length, 2);
  assert.match(interactive, /role="switch"/);
  assert.match(interactive, /aria-current="true"/);
  assert.match(interactive, /data-slot="controls"[^>]*inert=""/);
  assert.doesNotMatch(interactive, /role="listbox"|role="option"|aria-selected=/);
  assert.doesNotMatch(interactive, /<button\b[^>]*>(?:(?!<\/button>)[\s\S])*<input\b/, "Controls must be siblings of navigation buttons");
  console.log("PASS ColumnBrowser SSR: nested/controlled paths, leaf details, fragments/rich labels, empty/disabled branches, stale paths and invalid composition.");
} finally { await server.close(); }
