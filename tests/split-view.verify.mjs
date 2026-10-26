import assert from "node:assert/strict";
import { createElement as h, Fragment } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";

const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite/verify-split-view", server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const { NavigationSplitView } = await server.ssrLoadModule("/src/ohmygui/navigation/NavigationSplitView.tsx");
  const html = render(h(NavigationSplitView, {
    id: "workspace", sidebarScrollKey: "workspace", paneAnimation: false,
    contentTransitionKey: "destination", detailTransitionKey: 3,
    sidebar: h("a", { href: "/destination" }, "Real destination"),
    content: "Readable content", detail: "Readable detail",
  }));
  assert.match(html, /href="\/destination"/);
  assert.match(html, /<aside[^>]*data-slot="sidebar"/);
  assert.match(html, /Readable content/); assert.match(html, /Readable detail/);
  assert.equal((html.match(/data-split-pane=""/g) ?? []).length, 3);
  assert.doesNotMatch(html, /\s(?:sidebarScrollKey|paneAnimation|contentTransitionKey|detailTransitionKey)=/i);
  assert.doesNotMatch(html, /opacity:\s*0|data-enhanced="true"/);
  const collapsed = render(h(NavigationSplitView, { defaultCollapsed: true, sidebar: "Navigation", content: "Content" }));
  assert.match(collapsed, /<aside[^>]*inert=""[^>]*aria-hidden="true"/);
  const composed = render(h(NavigationSplitView, { sidebarWidth: 100 },
    h(Fragment, null, false, h(NavigationSplitView.SideBar, { label: "Projects", width: "14rem", id: "projects", "data-custom": "kept" }, "Project directory")),
    h(NavigationSplitView.Content, { label: "Editor", transitionKey: "draft" }, "Draft"),
    h(NavigationSplitView.Detail, { label: "Inspector" }, "Details")));
  assert.match(composed, /data-viewport="false"/, "Default sizing belongs to the container");
  assert.match(composed, /--ui-sidebar-width:14rem/);
  assert.match(composed, /<aside(?=[^>]*aria-label="Projects")(?=[^>]*data-custom="kept")(?=[^>]*id="projects")/);
  assert.match(composed, /aria-label="Editor"/);
  assert.match(composed, /aria-label="Inspector"/);
  assert.match(composed, /Project directory/);
  assert.equal((composed.match(/data-split-pane=""/g) ?? []).length, 3, "Compound panes do not add wrapper elements");
  assert.doesNotMatch(composed, /<(?:aside|section)\b[^>]*\s(?:label|width|transitionKey)=/i);
  assert.match(render(h(NavigationSplitView, { viewport: true }, h(NavigationSplitView.Content, null, "Full height"))), /data-viewport="true"/);
  assert.throws(() => render(h(NavigationSplitView, null, h(NavigationSplitView.Content), h(NavigationSplitView.Content))), /only one content/);
  assert.throws(() => render(h(NavigationSplitView, null, h("div"))), /expects SideBar/);
  console.log("PASS NavigationSplitView: SSR-readable panes, native link, hidden sidebar semantics, enhancement-only props stay off DOM");
} finally { await server.close(); }
