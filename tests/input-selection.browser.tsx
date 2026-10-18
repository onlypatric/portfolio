/** Astro dev: import('/tests/input-selection.browser.tsx').then(m => m.runSelectionInputChecks()) */
import { type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Checkbox, Toggle, RadioGroup, SegmentedPicker, Form, FieldGroup } from "../src/_components/common/ohmygui/input";

export async function runSelectionInputChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;overflow:auto;background:var(--background);color:var(--foreground);padding:12px";
  stage.style.cssText = "display:grid;gap:20px;width:500px;max-width:100%"; host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [], errors: string[] = [];
  const originalError = console.error; console.error = (...args) => { errors.push(args.map(String).join(" ")); originalError(...args); };
  const wait = (ms = 60) => new Promise(resolve => setTimeout(resolve, ms));
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const q = <T extends HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const click = async (element: HTMLElement, ms = 60) => { flushSync(() => element.click()); await wait(ms); };
  const check = async (name: string, test: () => Promise<void>) => { try { await test(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); } report.textContent = results.map(item => `${item.passed ? "PASS" : "FAIL"} ${item.name}${item.error ? ": " + item.error : ""}`).join("\n"); };
  const options = [{ value: "first", label: "First" }, { value: "second", label: "Second" }, { value: "third", label: "Unavailable", disabled: true }];
  const quiet = () => matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)").matches;
  try {
    await check("Toggle forwards refs, distinct name/description, native values/reset and controlled rejection", async () => {
      const ref = { current: null as HTMLInputElement | null };
      await render(<Form><Toggle ref={ref} label="Quiet mode" description="Pause alerts" name="quiet" defaultChecked /><Toggle label="Controlled" name="controlled" checked={false} onChange={() => {}} /></Form>);
      const input = q<HTMLInputElement>('[name="quiet"]'); assert(ref.current === input, "Toggle ref is not native input");
      assert(stage.querySelector('[id="' + input.getAttribute("aria-labelledby") + '"]')?.textContent === "Quiet mode", "Switch name includes helper description");
      assert(stage.querySelector('[id="' + input.getAttribute("aria-describedby") + '"]')?.textContent === "Pause alerts", "Switch description missing");
      assert(new FormData(q<HTMLFormElement>("form")).get("quiet") === "on", "Checked switch not submitted");
      await click(input); assert(!input.checked, "Uncontrolled switch did not change");
      q<HTMLFormElement>("form").reset(); await wait(); assert(input.checked, "Switch reset failed");
      const controlled = q<HTMLInputElement>('[name="controlled"]'); await click(controlled); assert(!controlled.checked, "Switch ignored parent rejection");
      if (matchMedia("(forced-colors: active)").matches) assert(getComputedStyle(input).appearance === "auto" && getComputedStyle(q('[data-slot="track"]')).display === "none", "Forced colors switch is not native");
    });
    await check("Radio/segment groups submit/reset/validate, retain native focus and honor disabled/controlled states", async () => {
      for (const Group of [RadioGroup, SegmentedPicker]) {
        const collection = Group === RadioGroup ? { items: options } : { choices: options };
        await render(<Form><Group {...collection as any} name="choice" defaultValue="first" required helperText="Pick one" /></Form>);
        const first = q<HTMLInputElement>('[value="first"]'), second = q<HTMLInputElement>('[value="second"]'), disabled = q<HTMLInputElement>('[value="third"]');
        second.focus(); assert(document.activeElement === second, "Native radio cannot focus"); await click(second);
        assert(second.checked && !first.checked && new FormData(q<HTMLFormElement>("form")).get("choice") === "second", "Radio selection/form value failed");
        await click(disabled); assert(!disabled.checked, "Disabled option changed"); q<HTMLFormElement>("form").reset(); await wait(); assert(first.checked, "Radio group reset failed");
        const stop = (event: Event) => event.preventDefault(), form = q<HTMLFormElement>("form"); form.addEventListener("reset", stop);
        await click(second); form.reset(); await wait(); assert(second.checked, "Prevented reset changed radios"); form.removeEventListener("reset", stop);
        await render(<Group {...collection as any} name="choice" value="first" onChange={() => {}} />); await click(q('[value="second"]'));
        assert(q<HTMLInputElement>('[value="first"]').checked && !q<HTMLInputElement>('[value="second"]').checked, "Controlled group ignored parent rejection");
        await render(<Form><Group {...collection as any} name="choice" required /></Form>); assert(!q<HTMLFormElement>("form").checkValidity(), "Required group accepted no selection");
      }
      await render(<Form><FieldGroup legend="Unavailable" disabled><Toggle label="Switch" name="quiet" /><RadioGroup items={options} name="radio" /><SegmentedPicker choices={options} name="segment" /></FieldGroup></Form>);
      for (const input of stage.querySelectorAll<HTMLInputElement>("input")) { assert(input.matches(":disabled"), "Native fieldset disabling lost"); await click(input); assert(!input.checked, "Inherited disabled input changed"); }
      assert([...new FormData(q<HTMLFormElement>("form"))].length === 0, "Disabled options submitted");
    });
    await check("Segment selection layer follows selection/reset, interrupts transform motion and has no layout animation", async () => {
      await render(<Form><SegmentedPicker choices={options} name="motion" defaultValue="first" /></Form>);
      const track = q<HTMLElement>('[data-slot="segments"]'), indicator = q<HTMLElement>('[data-slot="selectionIndicator"]');
      await click(q('[value="second"]'), 25);
      if (quiet()) assert(indicator.hidden && !track.hasAttribute("data-selection-enhanced") && indicator.getAnimations().length === 0, "Reduced/forced mode retained selection animation");
      else {
        const animations = indicator.getAnimations(); assert(animations.length === 1 && animations[0].id === "ui-segment-selection", "Selection travel missing or duplicated");
        const frames = (animations[0].effect as KeyframeEffect).getKeyframes(); assert(frames.every(frame => !('width' in frame) && !('height' in frame)), "Layout properties animated");
        await click(q('[value="first"]'), 25); assert(indicator.getAnimations().length === 1, "Interruption leaked an animation");
        // Animation finish events follow the browser's animation clock, not a
        // fixed wall-clock timeout (especially while DevTools/emulation is busy).
        const deadline = performance.now() + 1500;
        while (indicator.getAnimations().length && performance.now() < deadline) await wait(25);
        assert(indicator.getAnimations().length === 0 && !track.hasAttribute("data-traveling"), "Finished animation not cleaned up");
        const selected = q<HTMLElement>('[value="first"]').closest('label')!.getBoundingClientRect(), rect = indicator.getBoundingClientRect();
        assert(Math.abs(selected.left - rect.left) < 1 && Math.abs(selected.width - rect.width) < 1, "Indicator settled at wrong geometry");
      }
      await click(q('[value="second"]')); q<HTMLFormElement>("form").reset(); await wait(220); assert(q<HTMLInputElement>('[value="first"]').checked, "Animated group reset lost selection");
    });
    await check("Checkbox native ref/mixed state, rapid reversal, reset prevention and unmount cleanup", async () => {
      const ref = { current: null as HTMLInputElement | null };
      await render(<Form><Checkbox ref={ref} name="updates" aria-label="Updates" /></Form>);
      const input = q<HTMLInputElement>("input"); assert(ref.current === input, "Checkbox ref is not native input");
      await click(input, 30); await click(input, 30); assert(!input.checked, "Rapid checkbox reversal failed");
      assert(input.getAnimations({ subtree: true }).length === (quiet() ? 0 : 2), "Unexpected checkbox animation count");
      await wait(350); await click(input); const form = q<HTMLFormElement>("form"), prevent = (event: Event) => event.preventDefault(); form.addEventListener("reset", prevent); form.reset(); await wait(); assert(input.checked, "Prevented reset changed checkbox"); form.removeEventListener("reset", prevent);
      await render(<Checkbox indeterminate aria-label="Mixed" />); assert(q<HTMLInputElement>("input").indeterminate, "Mixed property missing");
      await render(<Checkbox indeterminate aria-label="Mixed updated" />); assert(q<HTMLInputElement>("input").indeterminate, "Mixed property lost on rerender");
      await render(<Checkbox aria-label="Removal" />); const detached = q<HTMLInputElement>("input"); await click(detached, 25); await render(<div>Removed</div>); assert(detached.getAnimations({ subtree: true }).length === 0, "Unmount leaked checkbox animation");
    });
    await check("Selection layouts fit 240px, use logical RTL motion and retain system-color fallbacks", async () => {
      await render(<><Toggle label="Quiet mode" description="A long description that should wrap without overflowing" defaultChecked /><RadioGroup legend="Frequency" items={options} name="frequency" defaultValue="first" /><SegmentedPicker label="Density" choices={options} name="density" defaultValue="second" /></>);
      stage.style.width = "240px";
      for (const theme of ["light", "dark"]) for (const dir of ["ltr", "rtl"]) {
        stage.className = theme; stage.dir = dir; await wait(220);
        for (const element of stage.querySelectorAll<HTMLElement>('[data-ui="Toggle"],fieldset')) assert(element.scrollWidth <= element.clientWidth + 1, "Selection control overflows narrow layout");
        if (!matchMedia("(forced-colors: active)").matches) {
          const thumb = q<HTMLElement>('[data-slot="thumb"]'), matrix = new DOMMatrix(getComputedStyle(thumb).transform);
          assert(dir === "rtl" ? matrix.m41 < 0 : matrix.m41 > 0, "Switch thumb does not follow logical direction");
        }
        const track = q<HTMLElement>('[data-slot="segments"]'), indicator = q<HTMLElement>('[data-slot="selectionIndicator"]');
        if (matchMedia("(forced-colors: active)").matches) assert(getComputedStyle(track.querySelector('input:checked + span')!).forcedColorAdjust === "none", "System-color selection allows an unreadable forced text backplate");
        if (!quiet()) { track.scrollLeft = dir === "rtl" ? -50 : 50; await wait(); const rect = track.querySelector('input:checked')!.closest('label')!.getBoundingClientRect(), actual = indicator.getBoundingClientRect(); assert(Math.abs(actual.left - rect.left) < 1, `Scrolled ${dir} segment indicator drifted: ${actual.left} vs ${rect.left}`); }
      }
      assert(!errors.length, errors.join("; "));
    });
  } finally { console.error = originalError; }
  const failures = results.filter(item => !item.passed); console.table(results); document.title = `Selection inputs: ${results.length} checks, ${failures.length} failed`;
  return { results, failures, reduced: matchMedia("(prefers-reduced-motion: reduce)").matches, forced: matchMedia("(forced-colors: active)").matches, dispose: () => { root.unmount(); host.remove(); } };
}
