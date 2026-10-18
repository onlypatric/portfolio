import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";

const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const { NavigationSplitView } = await server.ssrLoadModule("/src/_components/common/ohmygui/navigation/NavigationSplitView.tsx");
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
  console.log("PASS NavigationSplitView: SSR-readable panes, native link, hidden sidebar semantics, enhancement-only props stay off DOM");
} finally { await server.close(); }
