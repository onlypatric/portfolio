import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";
import { readFileSync } from "node:fs";

const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
const base = "/src/ohmygui/";
const load = async (family, name) => (await server.ssrLoadModule(base + family + "/" + name + ".tsx"))[name];
try {
  const material = { blur: "17px", opacity: .8, tint: "#224433" };
  for (const [family, name, props] of [
    ["drawing", "MaterialSurface", {}], ["navigation", "Sidebar", { items: [] }],
    ["navigation", "TabBar", { items: [] }], ["navigation", "TabView", { tabs: [] }],
    ["presentation", "Popover", { open: true, trigger: "Open" }], ["presentation", "Menu", { open: true, trigger: "Open", items: [] }],
    ["presentation", "Toast", { message: "Saved", duration: 0 }], ["presentation", "Banner", { title: "Status" }],
    ...["ModalSurface", "Dialog", "ConfirmationDialog", "CommandPalette", "FullScreenCover"].map(name => ["presentation", name, { open: true, title: "Modal", choices: [], commands: [] }]),
  ]) {
    const Component = await load(family, name);
    const html = render(h(Component, { ...props, material }));
    assert.match(html, /data-material="true"/, name + " opts into the shared material boundary");
    assert.match(html, /--ui-material-blur:17px/, name + " uses the shared blur variable");
    assert.doesNotMatch(html, /\smaterial="|\sbackdropMaterial="/, name + " does not leak API objects into DOM attributes");
    assert.doesNotMatch(html, /style="[^"]*(?:backdrop-filter|filter):/, name + " leaves fallbacks under CSS control");
  }
  const Modal = await load("presentation", "ModalSurface");
  assert.match(render(h(Modal, { open: true, backdropMaterial: material })), /--ui-backdrop-blur:17px/);
  assert.match(render(h(Modal, { open: true, material: true })), /data-backdrop-material="false"/, "No implicit content/backdrop double blur");
  const FullScreenCover = await load("presentation", "FullScreenCover");
  assert.match(render(h(FullScreenCover, { open: true })), /data-backdrop-material="false"/);
  const Surface = await load("drawing", "MaterialSurface");
  assert.match(render(h(Surface, { material: false, opacity: 3 })), /data-material="false".*--ui-material-opacity:100%/);
  const Split = await load("navigation", "NavigationSplitView");
  const split = render(h(Split, { sidebar: "Nav", content: "Main", viewport: false, paneMaterials: { sidebar: material } }));
  assert.match(split, /<aside[^>]*data-material="true"/);
  assert.match(split, /<section[^>]*data-material="false"/);
  const Image = await load("content", "Image");
  assert.doesNotMatch(render(h(Image, { src: "/image.svg", alt: "Useful content", decorativeBlur: "8px" })), /ui-decorative-blur/);
  assert.match(render(h(Image, { src: "/image.svg", alt: "", decorativeBlur: "8px" })), /ui-decorative-blur/);
  const AsyncImage = await load("content", "AsyncImage");
  assert.match(render(h(AsyncImage, { src: "/final.svg", alt: "Useful content", placeholderSrc: "/thumb.svg" })), /data-slot="thumbnail" alt=""/);
  const Background = await load("layout", "Background"), Overlay = await load("layout", "Overlay");
  assert.match(render(h(Background, { image: "/photo.jpg", decorativeBlur: "12px" }, "Sharp")), /data-slot="background"/);
  assert.doesNotMatch(render(h(Overlay, { interactive: true, decorativeBlur: "12px", overlay: "Interactive" }, "Sharp")), /ui-decorative-blur/);
  const css = readFileSync("src/ohmygui/theme.css", "utf8");
  assert.match(css, /@supports \(\(backdrop-filter: blur/);
  assert.match(css, /prefers-reduced-transparency: reduce/);
  assert.match(css, /forced-colors: active/);
  assert.doesNotMatch(css, /transition:[^;}]*\b(?:backdrop-filter|filter)\b/, "Blur radii are not continuously animated");
  console.log("PASS Gaussian materials: every surface family, shared modal inheritance, opaque opt-out, clamping, pane isolation, sharp content and decorative layers; preference/feature guards present");
} finally { await server.close(); }
