import assert from "node:assert/strict";
import { createElement as h, createRef, Fragment } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";

const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const { CodeText } = await server.ssrLoadModule("/src/_components/common/ohmygui/content/CodeText.tsx");
  const { Button } = await server.ssrLoadModule("/src/_components/common/ohmygui/control/button/Button.tsx");
  const source = 'const html = "<script>not executable</script>";\n\tconst answer = 42;';
  const actions = h(Fragment, null, h(Button, null, "Copy"), h(Button, null, "Expand"));
  const html = render(h(CodeText, { filename: "example.tsx", language: "tsx", actions, ref: createRef(), wrap: true, id: "source", title: "Native title", className: "custom-code", style: { color: "red" }, classNames: { root: "custom-root", actions: "custom-actions" } }, source));
  assert.match(html, /data-slot="filename"[^>]*>example\.tsx/);
  assert.match(html, /role="group" aria-label="Code actions"/);
  assert.equal((html.match(/data-ui-button=/g) ?? []).length, 2);
  assert.match(html, /<pre[^>]*tabindex="0"[^>]*role="region"/);
  const pre = html.match(/<pre\b[^>]*>([\s\S]*?)<\/pre>/)[1];
  assert.doesNotMatch(pre, /<button|Copy|Expand/);
  assert.match(pre, /&lt;script&gt;not executable&lt;\/script&gt;/);
  assert.match(pre, /id="source"/);
  assert.match(pre, /title="Native title"/);
  assert.match(pre, /data-wrap="true"/);
  assert.doesNotMatch(html, /\s(?:actions|filename|classNames|copyButton|wrap)=/);
  for (const controls of [undefined, null, false, []]) {
    const plain = render(h(CodeText, { actions: controls }, source));
    assert.doesNotMatch(plain, /data-slot="(?:header|actions)"/);
  }
  assert.doesNotMatch(render(h(CodeText, { inline: true }, "inline")), /<pre|<div|<span/);
  assert.match(render(h(CodeText, { inline: true, mode: "full" }, source)), /<pre/);
  const legacy = render(h(CodeText, { mode: "snippet", copyButton: h(Button, null, "Legacy") }, "command"));
  assert.match(legacy, /data-slot="copyButton"/);
  assert.doesNotMatch(legacy, /<pre|<div/);
  const priority = render(h(CodeText, { actions, copyButton: h(Button, null, "Ignored") }, source));
  assert.doesNotMatch(priority, /Ignored|data-slot="copyButton"/);
  assert.doesNotMatch(render(h(CodeText, { actions: null, copyButton: actions }, source)), /data-slot="actions"/);
  console.log("PASS CodeText: semantic SSR, exact escaped source, multi-actions outside code, optional chrome, legacy modes/slot, precedence, native props/ref and styling hooks");
} finally { await server.close(); }
