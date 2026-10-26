import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";
const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const base = "/src/ohmygui/input/";
  const { validDate, validMonth, addDays, addMonths, boundedDates, monthDates } = await server.ssrLoadModule(base + "_calendar.ts");
  for (const valid of ["0001-01-01", "0099-12-31", "2000-02-29", "2024-02-29", "9999-12-31"]) assert.equal(validDate(valid), true, valid);
  for (const invalid of ["0000-01-01", "2026-02-29", "2026-04-31", "2026-13-01", "2026-1-01", "not a date"]) assert.equal(validDate(invalid), false, invalid);
  assert.equal(validMonth("2026-10"), true); assert.equal(validMonth("2026-13"), false);
  assert.equal(addDays("2026-03-28", 2), "2026-03-30"); assert.equal(addDays("2024-02-28", 1), "2024-02-29");
  assert.equal(addMonths("2024-01-31", 1), "2024-02-29"); assert.equal(addMonths("2024-02-29", 12), "2025-02-28"); assert.equal(addMonths("2026-01-31", -1), "2025-12-31");
  assert.deepEqual(boundedDates(["2026-10-02", "2026-10-01", "2026-10-02", "invalid", "2027-01-01"], "2026-10-01", "2026-10-31"), ["2026-10-01", "2026-10-02"]);
  const october = monthDates("2026-10", 1); assert.equal(october.length, 42); assert.equal(october[3], "2026-10-01"); assert.equal(october.filter(Boolean).length, 31);
  assert.equal(monthDates("2024-02", 0).filter(Boolean).length, 29);
  const { MultiDatePicker } = await server.ssrLoadModule(base + "MultiDatePicker.tsx");
  const markup = render(h(MultiDatePicker, { initialMonth: "2026-10", min: "2026-09-01", max: "2027-05-31", name: "days", defaultSelected: ["2026-10-02", "2026-10-02", "2027-01-01"], helperText: "Pick dates", form: "external" }));
  assert.equal((markup.match(/data-date=/g) ?? []).length, 31); assert.equal((markup.match(/role="columnheader"/g) ?? []).length, 7);
  assert.equal((markup.match(/tabindex="0"/g) ?? []).length, 1); assert.match(markup, /aria-multiselectable="true"/);
  assert.equal((markup.match(/type="hidden"/g) ?? []).length, 2); assert.match(markup, /name="days"[^>]*value="2027-01-01"/);
  assert.doesNotMatch(markup, /<button(?![^>]*data-ui-button)/);
  const unanchored = render(h(MultiDatePicker, {})); assert.doesNotMatch(unanchored, /data-date=/); assert.match(unanchored, /local browser month/);
  const empty = render(h(MultiDatePicker, { min: "2026-10-31", max: "2026-10-01" })); assert.match(empty, /No dates available/);
  console.log("PASS calendar SSR/date math: strict local ISO, leap/DST-safe arithmetic, six-week grid, one Tab stop, multi-month named values, shared Buttons, bounded empty and deterministic unanchored SSR");
} finally { await server.close(); }
