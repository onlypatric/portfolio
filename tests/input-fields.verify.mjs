import assert from "node:assert/strict";
import { createElement as h, createRef } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";

const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const base = "/src/_components/common/ohmygui/input/";
  for (const name of ["TextField", "SecureField", "SearchField", "TextEditor", "DatePicker", "Picker"]) {
    const Component = (await server.ssrLoadModule(base + name + ".tsx"))[name];
    const html = render(h(Component, { id: name, name: "field", label: "Visible label", helperText: "Helpful", error: "Fix this", required: true, ref: createRef(), "aria-describedby": "external", startContent: "Prefix", endContent: "Suffix", items: [{ label: "One", value: "one" }] }));
    assert.match(html, new RegExp(`<label[^>]*for="${name}"`));
    assert.match(html, new RegExp(`aria-describedby="external ${name}-message"`));
    assert.match(html, /aria-invalid="true"/);
    assert.match(html, /data-slot="startContent"/); assert.match(html, /data-slot="endContent"/);
    assert.match(html, /Fix this/); assert.doesNotMatch(html, /Helpful/);
    assert.doesNotMatch(html, /\s(?:error|helperText|startContent|endContent|classNames|wrapperProps)=/);
    assert.doesNotMatch(html, /<label[^>]*>[\s\S]*?<button[\s\S]*?<\/label>/, "Reveal/actions must not be nested in a label");
    assert.match(html, /required=""/);
  }
  const { SecureField } = await server.ssrLoadModule(base + "SecureField.tsx");
  const disabled = render(h(SecureField, { label: "Secret", disabled: true, defaultValue: "demo" }));
  assert.match(disabled, /<button[^>]*disabled=""/); assert.match(disabled, /type="password"/);
  assert.doesNotMatch(render(h(SecureField, { revealable: false })), /<button|data-slot="endContent"/);
  const { SearchField } = await server.ssrLoadModule(base + "SearchField.tsx");
  assert.equal((render(h(SearchField, { suggestions: ["one", "one", "two"] })).match(/<option/g) ?? []).length, 2);
  const { FieldGroup } = await server.ssrLoadModule(base + "FieldGroup.tsx");
  const group = render(h(FieldGroup, { legend: "Fields", hint: "Associated hint", "aria-describedby": "external" }));
  assert.match(group, /aria-describedby="external [^"]+-hint"/); assert.match(group, /id="[^"]+-hint"/);
  console.log("PASS input field foundation: six native field contracts, explicit labels, description merging, error/helper precedence, safe adornments, refs, disabled password reveal and generated group hint IDs");
} finally { await server.close(); }
