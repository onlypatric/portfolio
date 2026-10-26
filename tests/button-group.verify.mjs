import assert from "node:assert/strict";
import { createElement as h, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

// Use the installed Vite transformer for TSX/CSS; no added test dependencies.
const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const { Button } = await server.ssrLoadModule("/src/ohmygui/control/button/Button.tsx");
  const { ButtonGroup } = await server.ssrLoadModule("/src/ohmygui/control/button/ButtonGroup.tsx");
  const render = (props, ...children) => renderToStaticMarkup(h(ButtonGroup, props, ...children));
  const html = render({ "aria-label": "Actions", size: "sm", variant: "secondary", disabled: true },
    h(Fragment, null, h(Button, { disabled: false }, "First"), null, false, h(Button, { size: "lg", variant: "danger" }, "Last")));
  assert.match(html, /role="group"/);
  assert.equal((html.match(/<button\b/g) ?? []).length, 2, "Fragments/conditional children flatten into direct buttons");
  assert.equal((html.match(/disabled=""/g) ?? []).length, 2, "Group disable cannot be overridden");
  assert.match(html, /data-size="sm"/, "Size inherits");
  assert.match(html, /data-size="lg"/, "Child size overrides");
  assert.match(html, /data-variant="secondary"/, "Variant inherits");
  assert.match(html, /data-variant="danger"/, "Child variant overrides");
  assert.match(html, /first:rounded-s-/, "Horizontal outer corners override default Button radii");
  assert.match(render({ orientation: "vertical", fullWidth: true }, h(Button, null, "Only")), /first:rounded-t-/);
  assert.doesNotThrow(() => render({}, null, false), "Empty group is safe");
  for (const child of ["Text", h("div", null, "Not a button"), h("div", { "data-ui-button": "" }, "Still not a button"), h("a", { href: "/" }, "Link")]) {
    assert.throws(() => render({}, child), /ButtonGroup/, "Reject non-button children");
  }
  function CompatibleButton({ variant, size, ...props }) { return h("button", { ...props, "data-size": size, "data-variant": variant }); }
  const compatible = render({ disabled: true, variant: "outline" }, h(CompatibleButton, { "data-ui-button": "" }, "Compatible"));
  assert.match(compatible, /disabled=""/, "Opted-in components receive native disabling");
  assert.match(compatible, /data-variant="outline"/, "Opted-in components receive group defaults");
  console.log("PASS ButtonGroup SSR: composition, inherited defaults, overrides, disabling, compatible children, invalid-child rejection and corner classes");
} finally {
  await server.close();
}
