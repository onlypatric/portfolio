import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";
const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const base = "/src/_components/common/ohmygui/input/";
  const { ProgressView } = await server.ssrLoadModule(base + "ProgressView.tsx");
  const progress = render(h(ProgressView, { label: "Upload", value: 250, max: 100 }));
  assert.match(progress, /<progress[^>]*value="100"/); assert.match(progress, /100%<\/output>/); assert.match(progress, /htmlFor=|for=/);
  const waiting = render(h(ProgressView, { value: NaN, max: 0 })); assert.match(waiting, /max="1"/); assert.doesNotMatch(waiting, /<progress[^>]*value=/); assert.match(waiting, /In progress/);
  const { Gauge } = await server.ssrLoadModule(base + "Gauge.tsx");
  const gauge = render(h(Gauge, { label: "Storage", min: 10, max: 100, low: -50, high: 500, optimum: 25, value: 500, formatValue: value => value + " GB" }));
  assert.match(gauge, /low="10"/); assert.match(gauge, /high="100"/); assert.match(gauge, /value="100"/); assert.match(gauge, /aria-valuetext="100 GB"/);
  assert.doesNotMatch(render(h(Gauge, { min: Infinity, max: NaN, value: NaN })), /Infinity|NaN/);
  const { Form } = await server.ssrLoadModule(base + "Form.tsx"); assert.match(render(h(Form, { action: "/sample", method: "post", encType: "multipart/form-data", noValidate: true })), /method="post"/);
  const { ControlGroup } = await server.ssrLoadModule(base + "ControlGroup.tsx"); const group = render(h(ControlGroup, { label: "Actions", disabled: true, orientation: "vertical" })); assert.match(group, /<fieldset[^>]*disabled=""/); assert.match(group, /<legend[^>]*>Actions<\/legend>/);
  const { LabeledContent } = await server.ssrLoadModule(base + "LabeledContent.tsx"); assert.match(render(h(LabeledContent, { label: "Status", value: "Ready" })), /<dt[^>]*>Status<\/dt><dd[^>]*>Ready<\/dd>/);
  const { HelpLink } = await server.ssrLoadModule(base + "HelpLink.tsx");
  const link = render(h(HelpLink, { href: "/help", target: "_blank", rel: "nofollow", label: "Help" })); assert.match(link, /rel="nofollow noopener noreferrer"/); assert.match(link, /opens in a new tab/);
  const disabled = render(h(HelpLink, { href: "/help", "aria-disabled": true })); assert.doesNotMatch(disabled, /href=/); assert.match(disabled, /role="link"/); assert.match(disabled, /tabindex="-1"/);
  console.log("PASS support SSR: finite native progress/meter, formatted labels, form/fieldset contracts, semantic metadata and safe/disabled help links");
} finally { await server.close(); }
