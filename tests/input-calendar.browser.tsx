/** Run with the page focused (close DevTools after scheduling), so native focus events can fire. */
import { type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MultiDatePicker, Form } from "../src/ohmygui/input";

export async function runCalendarInputChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;overflow:auto;background:var(--background);color:var(--foreground);padding:12px";
  stage.style.cssText = "display:grid;gap:20px;width:500px;max-width:100%"; host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [], errors: string[] = [];
  const originalError = console.error; console.error = (...args) => { errors.push(args.map(String).join(" ")); originalError(...args); };
  const wait = (ms = 60) => new Promise(resolve => setTimeout(resolve, ms));
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const q = <T extends HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const click = async (element: HTMLElement) => { flushSync(() => element.click()); await wait(); };
  const key = async (element: HTMLElement, key: string, shiftKey = false) => { const event = new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true }); flushSync(() => element.dispatchEvent(event)); await wait(); return event; };
  const check = async (name: string, test: () => Promise<void>) => { try { await test(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); } report.textContent = results.map(item => `${item.passed ? "PASS" : "FAIL"} ${item.name}${item.error ? ": " + item.error : ""}`).join("\n"); };
  try {
    await check("Calendar selects across more than 62 days, submits repeated native names, resets and honors prevented reset", async () => {
      const ref = { current: null as HTMLFieldSetElement | null };
      await render(<Form><MultiDatePicker ref={ref} initialMonth="2026-10" min="2026-10-01" max="2027-05-31" name="days" defaultSelected={["2026-10-17"]} /></Form>);
      assert(ref.current === q("fieldset"), "Calendar ref is not native fieldset");
      await click(q('[data-date="2026-10-18"]')); assert(q('[data-date="2026-10-18"]').getAttribute("aria-pressed") === "true", "Date did not select");
      for (let index = 0; index < 3; index++) await click(q('[aria-label="Next month"]'));
      assert(stage.textContent?.includes("January 2027") && stage.querySelectorAll('[data-date]').length === 31, "Calendar still truncates after 62 dates");
      await click(q('[data-date="2027-01-05"]')); const form = q<HTMLFormElement>("form"); assert(new FormData(form).getAll("days").join(",") === "2026-10-17,2026-10-18,2027-01-05", "Cross-month dates missing from native form");
      const prevent = (event: Event) => event.preventDefault(); form.addEventListener("reset", prevent); form.reset(); await wait(); assert(new FormData(form).getAll("days").length === 3, "Prevented reset lost selection"); form.removeEventListener("reset", prevent);
      form.reset(); await wait(); assert(new FormData(form).getAll("days").join() === "2026-10-17" && stage.textContent?.includes("October 2026"), "Calendar reset did not restore defaults/month");
    });
    await check("Roving arrows/Home/End and month/year paging preserve focus including leap-day clamping", async () => {
      await render(<MultiDatePicker key="keyboard" initialMonth="2024-01" min="2023-01-01" max="2025-12-31" defaultSelected={["2024-01-31"]} />);
      const initial = q<HTMLElement>('[data-date="2024-01-31"]'); initial.focus(); await key(initial, "PageDown");
      assert((document.activeElement as HTMLElement).dataset.date === "2024-02-29", "PageDown lost focus or leap-day clamp");
      await key(document.activeElement as HTMLElement, "PageDown", true); assert((document.activeElement as HTMLElement).dataset.date === "2025-02-28", "Year paging failed leap-day clamp");
      await key(document.activeElement as HTMLElement, "ArrowRight"); assert((document.activeElement as HTMLElement).dataset.date === "2025-03-01", "Arrow did not cross month boundary");
      await key(document.activeElement as HTMLElement, "Home"); assert((document.activeElement as HTMLElement).dataset.date === "2025-02-24", "Home did not move to week start");
      await key(document.activeElement as HTMLElement, "End"); assert((document.activeElement as HTMLElement).dataset.date === "2025-03-02", "End did not move to week end");
      assert(stage.querySelectorAll('[data-date][tabindex="0"]').length === 1, "Calendar has more than one date Tab stop");
    });
    await check("Bounds, controlled rejection, read-only browsing and inherited disabled states cannot mutate selection", async () => {
      let calls = 0;
      await render(<MultiDatePicker key="bounds" min="2026-10-15" max="2026-11-10" name="days" selected={["2026-10-16"]} onSelectedChange={() => calls++} />);
      assert(q<HTMLButtonElement>('[data-date="2026-10-14"]').disabled && q<HTMLButtonElement>('[aria-label="Previous month"]').disabled, "Minimum bound not enforced");
      await click(q('[data-date="2026-10-17"]')); assert(calls === 1 && q('[data-date="2026-10-17"]').getAttribute("aria-pressed") === "false", "Controlled date ignored parent rejection");
      await click(q('[aria-label="Next month"]')); assert(q<HTMLButtonElement>('[data-date="2026-11-11"]').disabled && q<HTMLButtonElement>('[aria-label="Next month"]').disabled, "Maximum bound not enforced");
      await render(<MultiDatePicker key="readonly" initialMonth="2026-10" readOnly defaultSelected={["2026-10-17"]} onSelectedChange={() => calls++} />);
      await click(q('[data-date="2026-10-18"]')); assert(calls === 1 && q('[data-date="2026-10-18"]').getAttribute("aria-pressed") === "false", "Read-only calendar mutated");
      await click(q('[aria-label="Next month"]')); assert(stage.textContent?.includes("November 2026"), "Read-only calendar cannot browse");
      await render(<Form><fieldset disabled><MultiDatePicker initialMonth="2026-10" name="days" defaultSelected={["2026-10-17"]} /></fieldset></Form>);
      for (const button of stage.querySelectorAll<HTMLButtonElement>("button")) assert(button.matches(":disabled"), "Inherited disabled calendar button remains available");
      assert(new FormData(q<HTMLFormElement>("form")).getAll("days").length === 0, "Disabled calendar submitted selection");
      await render(<MultiDatePicker key="empty" min="2026-10-31" max="2026-10-01" />); assert(stage.textContent?.includes("No dates available") && !stage.querySelector('[data-date][tabindex="0"]'), "Invalid range lacks empty state");
    });
    await check("Local browser month initializes without SSR clock hydration assumptions; narrow/RTL/theme semantics remain bounded", async () => {
      await render(<MultiDatePicker key="local" />); const now = new Date(), expected = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
      assert(q<HTMLElement>('[data-date]').dataset.date?.startsWith(expected), "Unanchored calendar did not choose local browser month");
      await render(<MultiDatePicker key="layout" initialMonth="2026-10" name="days" defaultSelected={["2026-10-17"]} />); stage.style.width = "240px";
      for (const theme of ["light", "dark"]) for (const dir of ["ltr", "rtl"]) {
        stage.className = theme; stage.dir = dir; await wait(180); const calendar = q<HTMLElement>('[data-ui="MultiDatePicker"]');
        assert(calendar.scrollWidth <= calendar.clientWidth + 1 && calendar.getBoundingClientRect().width <= 240, "Calendar overflows narrow viewport");
        const day = q<HTMLElement>('[data-date="2026-10-17"]'); day.focus(); await key(day, "ArrowRight");
        assert((document.activeElement as HTMLElement).dataset.date === (dir === "rtl" ? "2026-10-16" : "2026-10-18"), "Arrow does not follow logical calendar direction");
        assert(stage.querySelectorAll('[role="columnheader"][aria-label]').length === 7, "Weekday names missing");
      }
      assert(!errors.length, errors.join("; "));
    });
  } finally { console.error = originalError; }
  const failures = results.filter(item => !item.passed); console.table(results); document.title = `Calendar inputs: ${results.length} checks, ${failures.length} failed`;
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}
