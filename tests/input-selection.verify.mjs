import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";
const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const base = "/src/_components/common/ohmygui/input/";
  const { Toggle } = await server.ssrLoadModule(base + "Toggle.tsx");
  const toggle = render(h(Toggle, { label: "Quiet mode", description: "Pause alerts", name: "quiet", defaultChecked: true, "aria-describedby": "external", ref: { current: null } }));
  assert.match(toggle, /type="checkbox"/); assert.match(toggle, /role="switch"/); assert.match(toggle, /checked=""/);
  const labelId = toggle.match(/aria-labelledby="([^"]+)"/)[1];
  assert.ok(toggle.includes(`id="${labelId}"`)); assert.match(toggle, /aria-describedby="external [^"]+-description"/);
  for (const [name, collection] of [["RadioGroup", "items"], ["SegmentedPicker", "choices"]]) {
    const component = (await server.ssrLoadModule(base + name + ".tsx"))[name];
    const options = [{ value: "first", label: "First" }, { value: "second", label: "Second", disabled: true }];
    const markup = render(h(component, { [collection]: options, name: "choice", defaultValue: "first", required: true, disabled: true, form: "external-form", helperText: "Choose one", "aria-describedby": "external" }));
    assert.match(markup, /<fieldset[^>]*disabled=""/); assert.equal((markup.match(/type="radio"/g) ?? []).length, 2);
    assert.equal((markup.match(/required=""/g) ?? []).length, 2); assert.equal((markup.match(/form="external-form"/g) ?? []).length, 3);
    assert.equal((markup.match(/checked=""/g) ?? []).length, 1); assert.match(markup, /<legend[^>]*>choice<\/legend>/);
    assert.match(markup, /aria-describedby="external [^"]+-message"/);
    assert.match(render(h(component, { [collection]: [], name: "empty" })), /role="status"/);
    const controlled = render(h(component, { [collection]: options, name: "choice", value: "second", defaultValue: "first" }));
    assert.match(controlled, /value="second"[^>]*checked=""|checked=""[^>]*value="second"/);
  }
  const { Checkbox } = await server.ssrLoadModule(base + "Checkbox.tsx");
  assert.match(render(h(Checkbox, { name: "updates", defaultChecked: true, required: true, ref: { current: null } })), /type="checkbox"/);
  console.log("PASS selection SSR: native switches/radios/checkbox, labels/descriptions, form ownership, required/disabled, defaults/controlled state and empty groups");
} finally { await server.close(); }
