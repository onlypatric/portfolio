import assert from "node:assert/strict";
import { createElement as h, createRef } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";

const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const base = "/src/ohmygui/presentation/";
  for (const name of ["ModalSurface", "Dialog", "ConfirmationDialog", "CommandPalette", "FullScreenCover"]) {
    const Component = (await server.ssrLoadModule(base + name + ".tsx"))[name];
    const html = render(h(Component, { open: true, title: "Readable prompt", triggerRef: createRef(), openingAnimation: false, closingAnimation: false, choices: [], commands: [] }, "Useful content"));
    assert.match(html, /<dialog[^>]*open=""/);
    assert.match(html, /Readable prompt/);
    assert.doesNotMatch(html, /triggerRef=|openingAnimation=|closingAnimation=|data-opening=|data-closing=|transform:|opacity:0/);
  }
  const { modalOpeningFrames } = await server.ssrLoadModule(base + "_modal-motion.ts");
  const target = { left: 300, top: 200, width: 400, height: 240 };
  for (const source of [{ left: 20, top: 40, width: 120, height: 40 }, { left: 900, top: 600, width: 50, height: 60 }]) {
    const frames = modalOpeningFrames(source, target);
    const [x, y, scale] = frames[0].transform.match(/-?\d+(?:\.\d+)?/g).map(Number);
    assert.equal(target.left + target.width / 2 + x, source.left + source.width / 2);
    assert.equal(target.top + target.height / 2 + y, source.top + source.height / 2);
    assert.ok(scale >= .15 && scale <= .85);
    assert.equal(frames.at(-1).opacity, 1);
  }
  assert.match(modalOpeningFrames(null, target)[0].transform, /scale\(0.96\)/);
  assert.match(modalOpeningFrames(null, target, "rotate(2deg)").at(-1).transform, /rotate\(2deg\)/);
  console.log("PASS modal opening: remaining inherited APIs, SSR/no-JS readability, no leaked props, trigger-centered geometry, uniform bounded scale and fallback");
} finally { await server.close(); }
