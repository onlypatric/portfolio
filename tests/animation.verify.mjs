import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const base = "/src/_components/common/ohmygui/behavior/";
  const { motionFrames, motionEffect } = await server.ssrLoadModule(base + "_motion-presets.ts");
  const names = ["Fade", "Slide", "Scale", "Rotate", "Flip", "Reveal", "Collapse", "Bounce", "Shake", "Pulse", "Float", "Stagger", "Animation", "Transition"];
  for (const name of names) {
    const Component = (await server.ssrLoadModule(base + name + ".tsx"))[name];
    const html = renderToStaticMarkup(h(Component, { id: "sample", duration: 500, replayKey: 1 }, h("span", null, "Readable before hydration")));
    assert.match(html, new RegExp(`data-ui="${name}"`));
    assert.match(html, /Readable before hydration/);
    assert.doesNotMatch(html, /style="[^"]*(?:opacity:0|visibility:hidden)/, name + " has readable SSR/no-JS content");
    assert.doesNotMatch(html, /\sduration="|\sreplayKey="/, name + " does not leak animation props into DOM attributes");
  }
  const { Transition } = await server.ssrLoadModule(base + "Transition.tsx");
  const hidden = renderToStaticMarkup(h(Transition, { active: false, unmountOnExit: true }, "Not initially mounted"));
  assert.match(hidden, /inert=""/); assert.match(hidden, /aria-hidden="true"/);
  assert.doesNotMatch(hidden, /Not initially mounted/);
  for (const effect of names.filter(name => !["Stagger", "Animation", "Transition"].includes(name)).map(name => name.toLowerCase())) {
    const settings = { effect, distance: 20 };
    const enter = motionFrames(settings, false, 80, false), exit = motionFrames(settings, true, 80, false);
    assert(enter.length >= 2 && exit.length >= 2, effect + " has entrance/exit frames");
    assert(!JSON.stringify(enter).includes("NaN"), effect + " is finite");
    assert(!enter.some(frame => "filter" in frame), effect + " never animates Gaussian blur");
  }
  assert.equal(motionEffect("fade-in"), "fade"); assert.equal(motionEffect("scale-out"), "scale"); assert.equal(motionEffect("unknown"), "fade");
  assert.match(motionFrames({ effect: "slide", direction: "start", distance: 20 }, false, 40, true)[0].transform, /20px/);
  assert.match(motionFrames({ effect: "slide", direction: "start", distance: 20 }, false, 40, false)[0].transform, /-20px/);
  assert.equal(motionFrames({ effect: "collapse" }, false, 80, false)[1].height, "80px");
  console.log("PASS animation family: 14 facades, SSR/no-JS visibility, presence semantics, every preset/exit, legacy aliases, RTL, measured collapse and no blur animation");
} finally { await server.close(); }
