import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";
const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const base = "/src/ohmygui/input/";
  const { Combobox } = await server.ssrLoadModule(base + "Combobox.tsx");
  const combo = render(h(Combobox, { label: "Workspace", name: "workspace", defaultValue: "Studio", options: [], helperText: "Choose one", required: true, autocomplete: "both" }));
  assert.match(combo, /role="combobox"/); assert.match(combo, /aria-expanded="false"/); assert.match(combo, /aria-autocomplete="both"/);
  assert.doesNotMatch(combo, /role="listbox"|aria-activedescendant|aria-controls/); assert.match(combo, /value="Studio"/); assert.match(combo, /aria-describedby="[^"]+-message"/);
  const { FilePicker } = await server.ssrLoadModule(base + "FilePicker.tsx");
  const files = render(h(FilePicker, { id: "files", label: "Images", name: "images", multiple: true, required: true, disabled: true, accept: "image/*", maxSize: 10 }));
  assert.match(files, /<label[^>]*for="files"/); assert.match(files, /type="file"/); assert.match(files, /multiple=""/); assert.match(files, /required=""/); assert.match(files, /disabled=""/);
  assert.match(files, /No files selected/); assert.match(files, /aria-describedby="files-message"/); assert.doesNotMatch(files, /maxSize=|<button/);
  const { ColorPicker } = await server.ssrLoadModule(base + "ColorPicker.tsx");
  const color = render(h(ColorPicker, { label: "Accent", name: "accent", defaultValue: "#ABc123", readOnly: true }));
  assert.match(color, /type="color"/); assert.match(color, /value="#abc123"/); assert.match(color, /#ABC123<\/output>/); assert.match(color, /readOnly=""/);
  assert.match(render(h(ColorPicker, { value: "rgba(1,2,3,.5)", allowAlpha: true })), /value="#000000"/);
  console.log("PASS picker SSR: collapsed editable combobox, native named/required/multiple files, explicit labels/messages, opaque sRGB normalization/output and read-only color");
} finally { await server.close(); }
