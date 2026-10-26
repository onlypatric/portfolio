import assert from "node:assert/strict";
import { createElement as h, Fragment } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";
import { readFileSync, existsSync } from "node:fs";

const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite/verify-drag-sort", server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const { Draggable } = await server.ssrLoadModule("/src/ohmygui/behavior/Draggable.tsx");
  const { Sortable } = await server.ssrLoadModule("/src/ohmygui/collection/Sortable.tsx");
  const item = (key, content = key) => h(Draggable.Item, { itemKey: key, label: String(key) }, content);
  const empty = h(Draggable.Empty, null, "Empty destination");
  const populated = render(h(Draggable.Container, { dragKey: "tasks", accept: ["tasks", "notes"], "aria-label": "Inbox" }, h(Fragment, null, item("task", h("input", { defaultValue: "Draft" })), false), empty));
  assert.match(populated, /data-ui="DraggableContainer"/);
  assert.match(populated, /data-item-key="task"/);
  assert.match(populated, /aria-label="Move task"/);
  assert.match(populated, /value="Draft"/);
  assert.doesNotMatch(populated, /Empty destination|dragKey=|itemKey=|payload=/);
  assert.doesNotMatch(render(h(Draggable.Item, { itemKey: "private", dragKey: "tasks", label: "Task", payload: { privateValue: "not-for-markup" } })), /not-for-markup/);
  assert.match(render(h(Draggable.Container, { dragKey: "tasks" }, empty)), /Empty destination/);
  assert.match(render(h(Draggable.Item, { itemKey: "a", dragKey: "tasks", label: "Task", disabled: true })), /disabled=""/);
  assert.match(render(h(Draggable, { payload: "Legacy text" }, "Legacy item")), /draggable="true"/);
  assert.throws(() => render(empty), /direct child/);
  assert.throws(() => render(h(Draggable.Item, { itemKey: "a", label: "Task" })), /dragKey/);
  assert.throws(() => render(h(Draggable.Item, { itemKey: NaN, dragKey: "tasks", label: "Task" })), /finite number/);
  assert.throws(() => render(h(Draggable.Container, { dragKey: "tasks" }, item("a"), item("a"))), /unique/);
  assert.throws(() => render(h(Draggable.Container, { dragKey: "tasks" }, empty, empty)), /Only one/);
  assert.throws(() => render(h(Draggable.Container, { dragKey: "tasks" }, h("div", null, empty))), /expects/);
  const row = (key, extra = {}) => h(Sortable.Item, { key, label: key, ...extra }, key + " content");
  const sorted = render(h(Sortable, { defaultOrder: ["b", "a"] }, row("a"), h(Fragment, null, row("b")), row("c")));
  assert.ok(sorted.indexOf("b content") < sorted.indexOf("a content"));
  assert.ok(sorted.indexOf("a content") < sorted.indexOf("c content"));
  assert.equal((sorted.match(/data-ui-drag-item=""/g) ?? []).length, 3);
  assert.throws(() => render(h(Sortable, null, h(Sortable.Item, { label: "No key" }, "Missing"))), /unique itemKey or React key/);
  assert.throws(() => render(h(Sortable, null, row("a"), row("a"))), /unique/);
  assert.match(render(h(Sortable, { disabled: true }, row("a"))), /disabled=""/);
  assert.match(render(h(Sortable, { emptyState: "No tasks" })), /No tasks/);
  const numeric = render(h(Sortable, { order: [1, "1"] }, row("one", { itemKey: 1 }), row("string", { itemKey: "1" })));
  assert.equal((numeric.match(/data-item-key="1"/g) ?? []).length, 2, "Numeric/string keys remain separate identities");
  console.log("PASS drag/sort SSR: legacy source, compound constraints, empty states, inherited groups, accessible handles, rich content, key validation and controlled/default order");
  if (process.argv.includes("--built")) {
    const output = existsSync("dist/client/index.html") ? "dist/client" : "dist";
    const draggable = readFileSync(output + "/ohmygui/draggable/index.html", "utf8");
    const sortable = readFileSync(output + "/ohmygui/sortable/index.html", "utf8");
    assert.equal((draggable.match(/data-ui="DraggableContainer"/g) ?? []).length, 2);
    assert.equal((draggable.match(/data-ui-drag-item=""/g) ?? []).length, 4);
    assert.match(draggable, /Drop a task into today/);
    assert.equal((sortable.match(/data-ui="Sortable"/g) ?? []).length, 1);
    assert.equal((sortable.match(/data-ui-drag-item=""/g) ?? []).length, 3);
    assert.match(sortable, /Sort A–Z/);
    assert.doesNotMatch(draggable + sortable, /This example could not render/);
    console.log("PASS built drag/sort showcases: real compound containers/items, empty target, arbitrary input content and copyable source routes");
  }
} finally { await server.close(); }
