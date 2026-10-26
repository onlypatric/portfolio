import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";
const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const base = "/src/ohmygui/";
  const { Button } = await server.ssrLoadModule(base + "control/button/Button.tsx");
  const pending = render(h(Button, { pending: true, loading: false, name: "save", value: "yes", type: "submit" }, "Save"));
  assert.match(pending, /disabled=""/); assert.match(pending, /aria-busy="true"/); assert.match(pending, /type="submit"/); assert.match(pending, /data-slot="spinner"/);
  const hold = render(h(Button, { longPress: 600 }, "Hold")); assert.match(hold, /scaleX\(0\)/); assert.doesNotMatch(hold, /transition:width/);
  const unstyled = render(h(Button, { variant: "unstyled" }, h("span", { "data-slot": "custom" }, "Tab"))); assert.match(unstyled, /<button[^>]*><span data-slot="custom">/);
  for (const name of ["PasteButton", "ShareLink"]) {
    const Component = (await server.ssrLoadModule(base + "input/" + name + ".tsx"))[name];
    const html = render(h(Component, { disabled: true })); assert.match(html, /data-ui-button=""/); assert.match(html, /disabled=""/); assert.doesNotMatch(html, /role="alert"|data-slot="fallback"/);
  }
  console.log("PASS action SSR: native buttons/forms, pending precedence, transform-only holds, unstyled DOM and static browser-capability controls");
} finally { await server.close(); }
