import { type ReactNode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { flushSync } from "react-dom";
import { DatePicker, Form, Button, FieldGroup } from "../src/_components/common/ohmygui/input";

/** Schedule, then focus the page. Keep DevTools open when emulating media features. */
export async function runDatePickerChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.style.cssText = "position:fixed;inset:0;z-index:99999;padding:16px;overflow:auto;background:var(--background);color:var(--foreground)";
  stage.style.cssText = "width:420px;max-width:100%;display:grid;gap:16px"; host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [];
  const wait = (ms = 70) => new Promise(resolve => setTimeout(resolve, ms));
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const q = <T extends HTMLElement = HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const click = async (node: HTMLElement) => { flushSync(() => node.click()); await wait(); };
  const open = () => click(q('[data-slot="dateTrigger"]'));
  const key = async (node: HTMLElement, key: string, shiftKey = false) => { node.dispatchEvent(new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true })); await wait(); };
  const check = async (name: string, test: () => Promise<void>) => { try { await test(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); } report.textContent = JSON.stringify(results, null, 2); };
  await check("Localized selection retains native ref, ISO values, onChange and focus", async () => {
    const ref = { current: null as HTMLInputElement | null }; let changed = "", count = 0;
    await render(<Form><DatePicker key="localized" ref={ref} locale="it-IT" name="date" label="Partenza" defaultValue="2026-10-17" onChange={event => { changed = event.currentTarget.value; count++; }} /></Form>);
    assert(ref.current === q("input"), "Ref lost native input"); assert(q('[data-slot="dateTrigger"]').textContent?.includes("17 ott 2026"), "Date not formatted in Italian");
    await open(); assert(q('[role="dialog"]').lang === "it-IT" && q('[role="columnheader"]').textContent?.includes("lun"), "Locale/week start missing");
    assert(document.activeElement === q('[data-date="2026-10-17"]'), "Selected date not focused");
    await click(q('[data-date="2026-10-20"]')); assert(changed === "2026-10-20" && count === 1, "Native change duplicated or missing");
    assert(new FormData(q<HTMLFormElement>("form")).get("date") === changed && q('[data-slot="dateTrigger"]').textContent?.includes("20 ott"), "ISO/form/display mismatch");
    assert(document.activeElement === q('[data-slot="dateTrigger"]') && !stage.querySelector('[role="dialog"]:not([aria-hidden="true"])'), "Selection did not close/restore focus");
  });
  await check("Controlled rejection, reset/prevented reset and native required/disabled/readOnly", async () => {
    let calls = 0; await render(<DatePicker key="controlled" label="Controlled" locale="en-US" value="2026-10-17" onValueChange={() => calls++} />);
    await open(); await click(q('[data-date="2026-10-20"]')); assert(calls === 1 && q<HTMLInputElement>("input").value === "2026-10-17" && q('[data-slot="dateTrigger"]').textContent?.includes("17"), "Controlled rejection ignored");
    await render(<Form><DatePicker key="reset" label="Reset" defaultValue="2026-10-17" name="date" /></Form>); await open(); await click(q('[data-date="2026-10-20"]'));
    const form = q<HTMLFormElement>("form"), stop = (event: Event) => event.preventDefault(); form.addEventListener("reset", stop); form.reset(); await wait(); assert(q<HTMLInputElement>("input").value === "2026-10-20", "Prevented reset changed value");
    form.removeEventListener("reset", stop); form.reset(); await wait(); assert(q('[data-slot="dateTrigger"]').textContent?.includes("17"), "Display not reset");
    await render(<Form><DatePicker key="required" label="Required" required /><Button type="submit">Submit</Button></Form>); assert(!q<HTMLFormElement>("form").checkValidity(), "Required empty value valid"); await wait(); assert(stage.querySelector('[role="dialog"]'), "Invalid native field did not reveal correction UI");
    await render(<FieldGroup disabled legend="Unavailable"><DatePicker label="Disabled" /></FieldGroup>); await open(); assert(!stage.querySelector('[role="dialog"]:not([aria-hidden="true"])'), "Inherited disabled opened");
    await render(<DatePicker key="readonly" label="Read only" readOnly defaultValue="2026-10-17" />); await open(); assert(!stage.querySelector('[role="dialog"]:not([aria-hidden="true"])'), "Readonly opened");
    await render(<DatePicker key="autofocus" label="Focus" autoFocus tabIndex={-1} />); assert(document.activeElement === q('[data-slot="dateTrigger"]') && q('[data-slot="dateTrigger"]').tabIndex === -1, "Focus remained on hidden native field or tabIndex lost");
    await render(<DatePicker key="hidden" hidden label="Hidden" />); assert(!stage.querySelector('[data-slot="dateTrigger"]'), "Hidden input gained a visible trigger");
  });
  await check("Browser preferences/languagechange, explicit override, opt-out and invalid locale", async () => {
    const descriptor = Object.getOwnPropertyDescriptor(navigator, "languages");
    try {
      Object.defineProperty(navigator, "languages", { configurable: true, value: ["it-IT", "en-US"] });
      await render(<DatePicker key="auto" label="Auto" defaultValue="2026-10-17" />); assert(q('[data-slot="dateTrigger"]').lang === "it-IT", "Browser preference ignored");
      Object.defineProperty(navigator, "languages", { configurable: true, value: ["fr-FR"] }); window.dispatchEvent(new Event("languagechange")); await wait(); assert(q('[data-slot="dateTrigger"]').lang === "fr-FR", "Language change ignored");
      await render(<DatePicker key="explicit" locale="de-DE" defaultValue="2026-10-17" />); assert(q('[data-slot="dateTrigger"]').lang === "de-DE", "Explicit locale did not win");
      await render(<DatePicker key="fixed" preferClientLocale={false} fallbackLocale="es-ES" />); assert(q('[data-slot="dateTrigger"]').lang === "es-ES", "Client opt-out ignored");
      await render(<DatePicker key="invalid" locale="not_valid" fallbackLocale="also_invalid" />); assert(q('[data-slot="dateTrigger"]').lang === "en-US", "Invalid locales did not fall back");
    } finally {
      if (descriptor) Object.defineProperty(navigator, "languages", descriptor); else Reflect.deleteProperty(navigator, "languages");
      // Other mounted examples also observe languagechange; restore their cached preference.
      window.dispatchEvent(new Event("languagechange"));
    }
  });
  await check("Roving leap/month/year navigation, bounds/steps, Escape and light dismiss", async () => {
    await render(<DatePicker key="keys" locale="en-US" defaultValue="2024-01-31" min="2023-01-01" max="2025-12-31" />); await open();
    await key(q('[data-date="2024-01-31"]'), "PageDown"); assert((document.activeElement as HTMLElement).dataset.date === "2024-02-29", "Leap month navigation failed");
    await key(document.activeElement as HTMLElement, "PageDown", true); assert((document.activeElement as HTMLElement).dataset.date === "2025-02-28", "Year navigation failed");
    await key(document.activeElement as HTMLElement, "Escape"); assert(!stage.querySelector('[role="dialog"]:not([aria-hidden="true"])') && document.activeElement === q('[data-slot="dateTrigger"]'), "Escape focus failed");
    await render(<DatePicker key="steps" locale="en-US" min="2026-10-01" max="2026-10-31" step={2} defaultValue="2026-10-17" />); await open();
    assert(q<HTMLButtonElement>('[data-date="2026-10-18"]').disabled, "Step restriction not applied"); await key(q('[data-date="2026-10-17"]'), "ArrowRight"); assert((document.activeElement as HTMLElement).dataset.date === "2026-10-19", "Keyboard did not skip step-disabled date");
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); await wait(); assert(!stage.querySelector('[role="dialog"]:not([aria-hidden="true"])'), "Outside press did not close");
    await render(<DatePicker key="empty" min="2026-11-01" max="2026-10-01" messages={{ unavailable: "Empty range" }} />); await open(); assert(q('[role="dialog"]').textContent?.includes("Empty range") && !stage.querySelector('[data-date][tabindex="0"]'), "Empty range missing recovery UI");
  });
  await check("Arabic digits/RTL, message/week overrides, responsive themes and cleanup", async () => {
    await render(<DatePicker key="rtl" locale="ar-EG" defaultValue="2026-10-17" weekStartsOn={1} messages={{ close: "Finish" }} />); await open();
    const popup = q('[role="dialog"]'); assert(popup.dir === "rtl" && q('[data-date="2026-10-17"]').textContent === "١٧", "RTL/digits not localized");
    assert(q('[role="columnheader"]').getAttribute("aria-label") === "الاثنين", "Week override not honored");
    for (const theme of ["light", "dark"]) { host.className = theme; stage.style.width = "240px"; window.dispatchEvent(new Event("resize")); await wait(); const rect = popup.getBoundingClientRect(); assert(rect.left >= 0 && rect.right <= innerWidth + 1 && popup.scrollWidth <= popup.clientWidth + 1, "Popup overflows viewport"); }
    await click([...popup.querySelectorAll("button")].find(button => button.textContent === "Finish")!); assert(!stage.querySelector('[role="dialog"]:not([aria-hidden="true"])'), "Message override close failed");
    await open(); await render(<div>Unmounted</div>); assert(!document.querySelector('.ui-date-panel'), "Unmount leaked popup");
    const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "showPopover");
    try {
      Object.defineProperty(HTMLElement.prototype, "showPopover", { configurable: true, value: undefined });
      await render(<DatePicker key="fallback" locale="en-US" defaultValue="2026-10-17" />); await open();
      assert(getComputedStyle(q('[role="dialog"]')).display !== "none", "Unsupported Popover API leaves a hidden calendar");
      await key(q('[data-date="2026-10-17"]'), "Escape");
    } finally { if (descriptor) Object.defineProperty(HTMLElement.prototype, "showPopover", descriptor); else Reflect.deleteProperty(HTMLElement.prototype, "showPopover"); }
  });
  await check("Hydration retains native SSR and switches locale without mismatch", async () => {
    const fixture = document.createElement("div"), errors: unknown[] = []; host.append(fixture);
    const node = <DatePicker locale="ja-JP" defaultValue="2024-02-29" label="Date" />; fixture.innerHTML = renderToString(node);
    const hydrated = hydrateRoot(fixture, node, { onRecoverableError: error => errors.push(error) });
    await wait(150); assert(!errors.length && fixture.querySelector('[data-slot="dateTrigger"]')?.getAttribute("lang") === "ja-JP", "Hydration mismatch/locale failure"); hydrated.unmount(); fixture.remove();
  });
  const failures = results.filter(result => !result.passed); console.table(results); document.title = `DatePicker: ${results.length} groups, ${failures.length} failed`;
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}
