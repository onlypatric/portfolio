/** Astro dev: import('/tests/input-numeric.browser.tsx').then(m => m.runNumericInputChecks()) */
import { useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Slider, RangeSlider, Stepper, Form, Button } from "../src/ohmygui/input";

export async function runNumericInputChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;overflow:auto;background:var(--background);color:var(--foreground);padding:12px";
  stage.style.cssText = "display:grid;gap:20px;width:500px;max-width:100%"; host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [], errors: string[] = [];
  const originalError = console.error; console.error = (...args) => { errors.push(args.map(String).join(" ")); originalError(...args); };
  const wait = () => new Promise(resolve => setTimeout(resolve, 60));
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const q = <T extends HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const fill = async (input: HTMLInputElement, value: string) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value); flushSync(() => input.dispatchEvent(new Event("input", { bubbles: true }))); await wait(); };
  const click = async (button: HTMLButtonElement) => { flushSync(() => button.click()); await wait(); };
  const check = async (name: string, test: () => Promise<void>) => { try { await test(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); } report.textContent = results.map(item => `${item.passed ? "PASS" : "FAIL"} ${item.name}${item.error ? ": " + item.error : ""}`).join("\n"); };
  await check("Slider has native form values, live uncontrolled output, reset and parent-controlled behavior", async () => {
    let observed = -1;
    await render(<Form><Slider label="Volume" name="volume" defaultValue={40} showValue onValueChange={next => observed = next} /><Slider label="Locked by parent" name="controlled" value={60} showValue /></Form>);
    const input = q<HTMLInputElement>('[name="volume"]'); await fill(input, "75");
    assert(observed === 75 && input.value === "75" && q("output").textContent === "75", "Uncontrolled output/value failed");
    assert(new FormData(q<HTMLFormElement>("form")).get("volume") === "75", "Slider form value failed");
    q<HTMLFormElement>("form").reset(); await wait(); assert(input.value === "40" && q("output").textContent === "40", "Slider reset failed");
    const controlled = q<HTMLInputElement>('[name="controlled"]'); await fill(controlled, "80"); assert(controlled.value === "60", "Parent-controlled slider changed without consent");
    const form = q<HTMLFormElement>("form"), prevent = (event: Event) => event.preventDefault(); form.addEventListener("reset", prevent);
    await fill(input, "90"); form.reset(); await wait(); assert(input.value === "90", "Prevented reset still changed slider"); form.removeEventListener("reset", prevent);
  });
  await check("Two thumbs clamp without crossover, keep stable names/order/ARIA bounds and reset", async () => {
    const ref = { current: null as HTMLDivElement | null };
    await render(<Form><RangeSlider ref={ref} label="Price" defaultLow={25} defaultHigh={75} lowName="low" highName="high" /></Form>);
    assert(ref.current === q('[data-ui="RangeSlider"]'), "Range root ref failed");
    const low = q<HTMLInputElement>('[name="low"]'), high = q<HTMLInputElement>('[name="high"]');
    await fill(low, "90"); assert(low.value === "75" && high.value === "75", "Lower thumb crossed upper");
    await fill(high, "10"); assert(high.value === "75" && low.getAttribute("aria-valuemax") === "75" && high.getAttribute("aria-valuemin") === "75", "Upper thumb crossed/lost dependent bounds");
    const data = new FormData(q<HTMLFormElement>("form")); assert(data.get("low") === "75" && data.get("high") === "75", "Range values not submitted");
    q<HTMLFormElement>("form").reset(); await wait(); assert(low.value === "25" && high.value === "75", "Range reset failed");
    assert(stage.querySelectorAll('input[type="range"]')[0] === low && low.tabIndex === 0 && high.tabIndex === 0, "Thumb DOM/Tab order changed");
    await render(<RangeSlider min={100} max={200} low={-500} high={500} />);
    assert(q<HTMLInputElement>('.ui-range-low').value === "100" && q<HTMLInputElement>('.ui-range-high').value === "200", "Out-of-bounds normalization failed");
  });
  await check("Stepper supports decimal steps, editable empty drafts, native values, reset and parent rejection", async () => {
    let observed = 0;
    await render(<Form><Stepper label="Amount" name="amount" defaultValue={.25} min={.05} max={.95} step={.1} onValueChange={next => observed = next} /></Form>);
    const input = q<HTMLInputElement>("input"); await click(q<HTMLButtonElement>('[aria-label="Increase"]'));
    assert(input.value === "0.35" && observed === .35 && !input.validity.stepMismatch, "Decimal step is off grid");
    input.focus(); await fill(input, ""); assert(input.value === "", "Empty numeric draft was immediately coerced");
    await fill(input, "0.55"); input.blur(); await wait(); assert(input.value === "0.55", "Valid numeric draft was lost");
    assert(new FormData(q<HTMLFormElement>("form")).get("amount") === "0.55", "Stepper native value failed");
    q<HTMLFormElement>("form").reset(); await wait(); assert(input.value === "0.25", "Stepper reset failed");
    await render(<Stepper label="Controlled" value={3} min={1} max={10} />); await click(q<HTMLButtonElement>('[aria-label="Increase"]'));
    assert(q<HTMLInputElement>("input").value === "3", "Controlled button change escaped parent value");
    await render(<Stepper label="Bounded" defaultValue={10} min={10} max={100} />);
    const bounded = q<HTMLInputElement>("input"); bounded.focus(); await fill(bounded, ""); await fill(bounded, "2"); assert(bounded.value === "2", "Intermediate bound draft was clamped too early");
    await fill(bounded, "25"); bounded.blur(); await wait(); assert(bounded.value === "25", "Multi-digit entry failed");
  });
  await check("Disabled/read-only controls and inherited fieldsets reject pointer, button and keyboard changes", async () => {
    await render(<Form><Stepper label="Read only" name="step" defaultValue={5} readOnly /><Slider label="Read only range" name="slide" value={50} readOnly /><fieldset disabled><RangeSlider lowName="low" highName="high" /><Stepper label="Inherited" name="inherited" defaultValue={3} /></fieldset></Form>);
    const step = q<HTMLInputElement>('[name="step"]'); await click(q<HTMLButtonElement>('[aria-label="Increase"]')); assert(step.value === "5", "Read-only stepper changed");
    const slide = q<HTMLInputElement>('[name="slide"]'), key = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }); slide.dispatchEvent(key); assert(key.defaultPrevented, "Read-only range keyboard path is active");
    const rail = q<HTMLElement>('[data-slot="rail"]'); rail.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 100 })); await wait();
    assert(q<HTMLInputElement>('[name="low"]').value === "25", "Inherited disabled rail changed");
    assert(!new FormData(q<HTMLFormElement>("form")).has("low"), "Disabled range submitted");
    for (const input of stage.querySelectorAll<HTMLInputElement>('fieldset input')) assert(input.matches(":disabled"), "Fieldset did not disable native input");
  });
  await check("Curated numeric layout stays within 240px in LTR/RTL and both themes", async () => {
    await render(<><Slider label="Volume" defaultValue={30} showValue /><RangeSlider label="Price range" /><Stepper label="Seats" defaultValue={3} min={1} max={10} /></>);
    stage.style.width = "240px";
    for (const theme of ["light", "dark"]) for (const dir of ["ltr", "rtl"]) {
      stage.className = theme; stage.dir = dir; await wait();
      for (const element of stage.querySelectorAll<HTMLElement>('[data-ui="Slider"], [data-ui="RangeSlider"], [data-ui="Stepper"]')) assert(element.scrollWidth <= element.clientWidth + 1, "Numeric control overflows narrow layout");
      assert(getComputedStyle(q<HTMLElement>('.ui-range')).direction === dir, "Range loses logical direction");
    }
    assert(!errors.length, errors.join("; "));
  });
  console.error = originalError; const failures = results.filter(item => !item.passed); console.table(results); document.title = `Numeric inputs: ${results.length} checks, ${failures.length} failed`;
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}
