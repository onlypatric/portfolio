import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { createServer } from "vite";
const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const base = "/src/_components/common/ohmygui/input/";
  const { DatePicker } = await server.ssrLoadModule(base + "DatePicker.tsx");
  const { resolveDateLocale, dateLocaleInfo } = await server.ssrLoadModule(base + "_date-locale.ts");
  assert.equal(resolveDateLocale(["invalid_locale", "zz-ZZ", "it-IT"]), "it-IT");
  assert.equal(resolveDateLocale([], "invalid_locale"), "en-US");
  assert.equal(dateLocaleInfo("en-US").weekStartsOn, 0); assert.equal(dateLocaleInfo("it-IT").weekStartsOn, 1);
  assert.equal(dateLocaleInfo("ar-EG").direction, "rtl"); assert.equal(dateLocaleInfo("it-IT").messages.today, "Oggi");
  const props = { id: "date", label: "Date", name: "date", defaultValue: "2024-02-29", min: "2024-01-01", max: "2024-12-31", required: true, locale: "it-IT", messages: { clear: "Reset date" } };
  const html = render(h(DatePicker, props));
  assert.match(html, /type="date"/); assert.match(html, /name="date"/); assert.match(html, /value="2024-02-29"/); assert.match(html, /required=""/);
  assert.doesNotMatch(html, /ui-date-native|dateTrigger|role="dialog"|\s(?:locale|fallbackLocale|preferClientLocale|messages|weekStartsOn|onValueChange)=/);
  assert.equal(html, render(h(DatePicker, props)), "SSR must not depend on browser locale or local clock");
  for (const mode of ["time", "datetime-local"]) assert.match(render(h(DatePicker, { mode })), new RegExp(`type="${mode}"`));
  console.log("PASS DatePicker: deterministic native SSR fallback, ISO/form contracts, safe locale preference resolution, localized messages/week starts/RTL and legacy time modes");
} finally { await server.close(); }
