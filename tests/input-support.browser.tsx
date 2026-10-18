/** Astro dev: schedule runSupportInputChecks(), then close DevTools for native focus behavior. */
import { type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { ProgressView, Gauge, Form, ControlGroup, LabeledContent, HelpLink, TextField, Button } from "../src/_components/common/ohmygui/input";

export async function runSupportInputChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;overflow:auto;background:var(--background);color:var(--foreground);padding:12px";
  stage.style.cssText = "display:grid;gap:20px;width:500px;max-width:100%"; host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [], errors: string[] = [];
  const originalError = console.error; console.error = (...args) => { errors.push(args.map(String).join(" ")); originalError(...args); };
  const wait = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms));
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const q = <T extends HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const click = async (element: HTMLElement) => { flushSync(() => element.click()); await wait(); };
  const fill = async (input: HTMLInputElement, value: string) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value); flushSync(() => input.dispatchEvent(new Event("input", { bubbles: true }))); await wait(); };
  const check = async (name: string, test: () => Promise<void>) => { try { await test(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); } report.textContent = results.map(item => `${item.passed ? "PASS" : "FAIL"} ${item.name}${item.error ? ": " + item.error : ""}`).join("\n"); };
  const quiet = () => matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)").matches;
  try {
    await check("Native progress/meter refs, labels, finite ranges, formatted values and transform-only updates", async () => {
      const progressRef = { current: null as HTMLProgressElement | null }, gaugeRef = { current: null as HTMLMeterElement | null };
      await render(<><ProgressView ref={progressRef} label="Upload" value={40} max={100} /><Gauge ref={gaugeRef} label="Storage" value={64} max={100} low={25} high={80} optimum={10} formatValue={value => value + " GB"} /></>);
      const progress = q<HTMLProgressElement>("progress"), meter = q<HTMLMeterElement>("meter"); assert(progressRef.current === progress && gaugeRef.current === meter, "Indicator native refs failed");
      assert(progress.labels?.[0].textContent?.includes("Upload") && meter.labels?.[0].textContent?.includes("Storage"), "Indicator labels missing");
      assert(progress.position === .4 && meter.value === 64 && meter.getAttribute("aria-valuetext") === "64 GB" && q('[data-ui="Gauge"]').dataset.tone === "warning", "Native values/units/threshold color incorrect");
      await render(<><ProgressView label="Upload" value={70} max={100} /><Gauge label="Storage" value={95} max={100} low={25} high={80} optimum={10} /></>); await wait(300);
      const progressFill = q<HTMLElement>('[data-ui="ProgressView"] [data-slot="fill"]');
      if (!matchMedia("(forced-colors: active)").matches) assert(Math.abs(new DOMMatrix(getComputedStyle(progressFill).transform).m11 - .7) < .01, "Progress fill does not match value");
      assert(q('[data-ui="Gauge"]').dataset.tone === "danger", "Gauge worst region missing");
      if (matchMedia("(forced-colors: active)").matches) assert(getComputedStyle(progressFill).display === "none" && getComputedStyle(q("progress")).opacity === "1", "Forced colors do not restore native indicator");
    });
    await check("Indeterminate progress has one visible-only effect, pauses for viewport/ancestor/document visibility and cleans up", async () => {
      await render(<ProgressView key="loop" label="Waiting" />); await wait(150);
      const fill = q<HTMLElement>('[data-slot="fill"]'); assert(!q("progress").hasAttribute("value"), "Indeterminate progress advertises a numeric value");
      if (quiet()) assert(fill.getAnimations().length === 0, "Accessibility preference did not stop indeterminate travel");
      else {
        let animation = fill.getAnimations()[0]; assert(fill.getAnimations().length === 1 && animation.id === "ui-progress-indeterminate", "Missing/duplicated indeterminate effect");
        const frames = (animation.effect as KeyframeEffect).getKeyframes(); assert(frames.every(frame => !('width' in frame) && !('height' in frame)), "Loop animates layout");
        stage.style.transform = "translateY(200vh)"; await wait(150); assert(animation.playState === "paused", "Offscreen progress keeps running");
        stage.style.transform = ""; await wait(150); assert(animation.playState === "running", "Visible progress did not resume");
        stage.style.visibility = "hidden"; await wait(); assert(animation.playState === "paused", "Invisible ancestor does not pause"); stage.style.visibility = ""; await wait();
        const original = Object.getOwnPropertyDescriptor(document, "visibilityState");
        try { Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" }); document.dispatchEvent(new Event("visibilitychange")); await wait(); assert(animation.playState === "paused", "Background document keeps running"); }
        finally { if (original) Object.defineProperty(document, "visibilityState", original); else Reflect.deleteProperty(document, "visibilityState"); document.dispatchEvent(new Event("visibilitychange")); }
        stage.dir = "rtl"; await wait(); animation = fill.getAnimations()[0]; assert((animation.effect as KeyframeEffect).getKeyframes()[0].transform === "translateX(300%)", "Indeterminate travel is not RTL aware");
      }
      await render(<div>Removed</div>); assert(fill.getAnimations().length === 0, "Unmount leaked a progress effect"); stage.dir = "ltr";
    });
    await check("Form forwards native ref/validation/submitter/reset and ControlGroup disables controls without faking link semantics", async () => {
      const formRef = { current: null as HTMLFormElement | null }, groupRef = { current: null as HTMLFieldSetElement | null }; let submits = 0, resets = 0, submitter = "";
      await render(<Form ref={formRef} onSubmit={event => { event.preventDefault(); submits++; submitter = (event.nativeEvent as SubmitEvent).submitter?.textContent ?? ""; }} onReset={() => { resets++; }}>
        <TextField label="Name" name="name" required defaultValue="" /><ControlGroup ref={groupRef} label="Actions"><Button type="submit">Save</Button><Button type="reset">Reset</Button></ControlGroup>
      </Form>);
      assert(formRef.current === q("form") && groupRef.current === q("fieldset"), "Form/group native refs failed"); await click(q('button[type="submit"]')); assert(submits === 0 && !formRef.current!.checkValidity(), "Required form submitted empty");
      await fill(q("input"), "Studio"); await click(q('button[type="submit"]')); assert(submits === 1 && submitter === "Save" && new FormData(formRef.current!).get("name") === "Studio", "Native submitter/FormData missing");
      await click(q('button[type="reset"]')); assert(resets === 1 && q<HTMLInputElement>("input").value === "", "Native form reset failed");
      await render(<Form><ControlGroup label="Unavailable" disabled><TextField label="Inactive" name="inactive" defaultValue="value" /><Button>Inactive</Button><HelpLink href="#local-help">Still a link</HelpLink></ControlGroup></Form>);
      assert(q("input").matches(":disabled") && q("button").matches(":disabled") && !new FormData(q<HTMLFormElement>("form")).has("inactive"), "Fieldset disabling lost native semantics"); assert(q<HTMLAnchorElement>("a").hasAttribute("href"), "Fieldset incorrectly disables links");
      await render(<Form hidden><Button hidden>Hidden</Button></Form>); assert(getComputedStyle(q("form")).display === "none" && getComputedStyle(q("button")).display === "none", "Appearance CSS overrides native hidden");
    });
    await check("Help links preserve native names/refs/security, block explicit aria-disabled navigation, and metadata stays semantic", async () => {
      let clicks = 0; const ref = { current: null as HTMLAnchorElement | null }, metadata = { current: null as HTMLDListElement | null };
      await render(<><HelpLink ref={ref} href="#local-help" target="_blank" rel="nofollow" label="Guidance" onClick={event => { event.preventDefault(); clicks++; }} /><HelpLink href="#local-help" aria-disabled label="Unavailable" onClick={() => { clicks++; }} /><LabeledContent ref={metadata} label="Status" value="Ready" /></>);
      const links = stage.querySelectorAll<HTMLAnchorElement>("a"); assert(ref.current === links[0] && links[0].rel.includes("noopener") && links[0].rel.includes("noreferrer") && links[0].textContent?.includes("new tab"), "External help contract missing");
      links[0].focus(); assert(document.activeElement === links[0], "Help link cannot focus"); await click(links[0]); await click(links[1]); assert(clicks === 1 && !links[1].hasAttribute("href") && links[1].tabIndex === -1, "Disabled help activated");
      assert(metadata.current === q("dl") && q("dt").textContent === "Status" && q("dd").textContent === "Ready", "Metadata semantics/ref changed");
    });
    await check("Indicators/metadata/groups wrap long content at 240px in both themes/RTL and preserve native controls", async () => {
      await render(<><ProgressView label="AReallyLongProgressLabelThatMustWrap" value={.5} /><Gauge label="Storage" value={.8} formatValue={() => "AVeryLongFormattedValueThatMustNeverEscapeItsContainer"} /><LabeledContent label="Workspace reference" value="AnExtremelyLongUnbrokenWorkspaceReferenceThatMustWrapComfortably" /><ControlGroup label="Related actions"><Button>ALongActionNameThatMustWrap</Button><HelpLink href="#local-help">HelpWithAnExtremelyLongName</HelpLink></ControlGroup></>);
      stage.style.width = "240px";
      for (const theme of ["light", "dark"]) for (const dir of ["ltr", "rtl"]) { stage.className = theme; stage.dir = dir; await wait(); for (const element of stage.querySelectorAll<HTMLElement>('[data-ui="ProgressView"],[data-ui="Gauge"],dl,fieldset')) assert(element.scrollWidth <= element.clientWidth + 1, "Support component overflows narrow view"); }
      assert(!errors.length, errors.join("; "));
    });
  } finally { console.error = originalError; }
  const failures = results.filter(item => !item.passed); console.table(results); document.title = `Support inputs: ${results.length} checks, ${failures.length} failed`;
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}
