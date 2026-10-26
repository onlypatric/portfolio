/** On Astro dev: import('/tests/animation.browser.tsx').then(m => m.runAnimationChecks()) */
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { useRef, useState, type ReactNode } from "react";
import { Animation, Bounce, Collapse, Fade, Flip, Float, Pulse, Reveal, Rotate, Scale, Shake, Slide, Stagger, Transition } from "../src/ohmygui/behavior";
import { Button } from "../src/ohmygui/control/button/Button";

export async function runAnimationChecks() {
  const host = document.createElement("section"), report = document.createElement("pre"), stage = document.createElement("div");
  host.id = "animation-checks";
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:var(--background);color:var(--foreground);padding:12px;overflow:auto;font:13px system-ui";
  report.style.cssText = "height:24vh;overflow:auto;white-space:pre-wrap";
  stage.style.cssText = "height:260px;max-height:65vh;width:640px;max-width:100%;overflow:auto;background:var(--surface);border:1px solid var(--border);padding:12px";
  host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [], errors: string[] = [];
  const capture = (event: ErrorEvent) => errors.push(event.message); window.addEventListener("error", capture);
  const wait = (ms = 50) => new Promise<void>(resolve => setTimeout(resolve, ms));
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const q = <T extends HTMLElement = HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const until = async (predicate: () => boolean, message: string, ms = 1600) => { const start = performance.now(); while (!predicate() && performance.now() - start < ms) await wait(20); assert(predicate(), message); };
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); stage.scrollTop = 0; await wait(60); };
  const check = async (name: string, run: () => Promise<void>) => {
    try { await run(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); }
    report.textContent = results.map(result => `${result.passed ? "PASS" : "FAIL"} ${result.name}${result.error ? ": " + result.error : ""}`).join("\n");
  };
  const content = <div style={{ height: 55 }}>A visible, useful element</div>;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scroller = (child: ReactNode) => <div data-scroll="" style={{ height: 150, overflow: "auto" }}><div style={{ height: 700 }} />{child}<div style={{ height: 500 }} /></div>;

  await check("All eleven presets produce real motion only when visible (or settle under reduced motion)", async () => {
    for (const Component of [Fade, Slide, Scale, Rotate, Flip, Reveal, Collapse, Bounce, Shake, Pulse, Float]) {
      await render(<Component duration={160} repeat={false}>{content}</Component>);
      const view = q('.ui-motion');
      if (!reduced) {
        await until(() => q('[data-slot="motion"]').getAnimations().length > 0, Component.name + " has no real animation");
        const frames = (q('[data-slot="motion"]').getAnimations()[0].effect as KeyframeEffect).getKeyframes();
        assert(frames.length >= 2, Component.name + " lacks motion frames");
      }
      await until(() => view.dataset.motionState === "entered", Component.name + " did not settle");
      assert(getComputedStyle(q('[data-slot="motion"]')).opacity === "1", Component.name + " leaves content invisible");
    }
  });
  await check("Entrances/delays wait offscreen, pause without consuming time, resume and finish", async () => {
    await render(scroller(<Fade duration={600} delay={80}>{content}</Fade>));
    const view = q('.ui-motion'), layer = q('[data-slot="motion"]');
    if (reduced) { assert(view.dataset.motionState === "entered", "Reduced motion should reveal content immediately"); return; }
    const initial = layer.getAnimations()[0];
    assert(view.dataset.motionState === "pending" && Number(initial.currentTime) === 0, "Offscreen entrance ran on mount");
    await wait(220); assert(Number(initial.currentTime) === 0, "Offscreen delay was consumed");
    q('[data-scroll]').scrollTop = 700;
    await until(() => view.dataset.motionState === "running", "Visible entrance did not start"); await wait(100);
    q('[data-scroll]').scrollTop = 0; await wait(70);
    const paused = Number(initial.currentTime); await wait(180);
    assert(initial.playState === "paused" && Math.abs(Number(initial.currentTime) - paused) < 3, "Offscreen animation kept ticking");
    q('[data-scroll]').scrollTop = 700; await until(() => view.dataset.motionState === "entered", "Re-entry did not resume/complete");
    assert(layer.getAnimations().length === 0, "Finished animation was not cleaned up");
  });
  await check("CSS-hidden, transparent and inert ancestors gate loops", async () => {
    await render(<div data-ancestor="" style={{ opacity: 0 }}><Float duration={300}>{content}</Float></div>);
    const ancestor = q('[data-ancestor]'), view = q('.ui-motion');
    if (reduced) return;
    assert(view.dataset.motionState === "pending", "Transparent ancestor did not gate motion");
    ancestor.style.opacity = "1"; await until(() => view.dataset.motionState === "running", "Visible ancestor did not release motion");
    ancestor.inert = true; await wait(70);
    const animation = q('[data-slot="motion"]').getAnimations()[0], time = Number(animation.currentTime); await wait(120);
    assert(animation.playState === "paused" && Math.abs(Number(animation.currentTime) - time) < 3, "Inert ancestor did not pause the loop");
    ancestor.inert = false; await until(() => animation.playState === "running", "Loop did not resume");
    ancestor.hidden = true; await wait(70); assert(animation.playState === "paused", "Hidden ancestor did not pause");
    ancestor.hidden = false; await until(() => animation.playState === "running", "Hidden/visible cycle did not resume");
  });
  await check("Page Visibility pauses real animation clocks and resumes them", async () => {
    await render(<Pulse duration={300}>{content}</Pulse>); if (reduced) return;
    const descriptor = Object.getOwnPropertyDescriptor(document, "visibilityState");
    let hidden = false;
    try {
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => hidden ? "hidden" : "visible" });
      const animation = q('[data-slot="motion"]').getAnimations()[0];
      hidden = true; document.dispatchEvent(new Event("visibilitychange")); await wait(50);
      const time = Number(animation.currentTime); await wait(150);
      assert(animation.playState === "paused" && Math.abs(Number(animation.currentTime) - time) < 3, "Background document consumed animation time");
      hidden = false; document.dispatchEvent(new Event("visibilitychange")); await wait(70);
      assert(animation.playState === "running" && Number(animation.currentTime) > time, "Visible document did not resume");
    } finally { if (descriptor) Object.defineProperty(document, "visibilityState", descriptor); else Reflect.deleteProperty(document, "visibilityState"); document.dispatchEvent(new Event("visibilitychange")); }
  });
  await check("Completed entrances obey once, re-entry replay, and replayKey without remounting", async () => {
    let count = 0;
    const finished = () => { count++; };
    await render(scroller(<Fade once={false} duration={90} onEnterComplete={finished}>{content}</Fade>));
    const scroll = q('[data-scroll]'); scroll.scrollTop = 700; await wait(180);
    const first = count; scroll.scrollTop = 0; await wait(70); scroll.scrollTop = 700; await wait(180);
    if (!reduced) assert(count === first + 1, "once=false did not replay on re-entry");
    let plays = 0;
    const view = (replayKey: number) => <Fade duration={90} replayKey={replayKey} onEnterComplete={() => { plays++; }}><input defaultValue="Draft" /></Fade>;
    await render(view(0)); await wait(160); const input = q<HTMLInputElement>('input'); input.value = "Kept draft";
    await render(view(1)); await wait(160);
    assert(plays === 2 && q('input') === input && input.value === "Kept draft", "Replay remounted state or failed to play");
  });
  await check("Legacy Transition classes/timing and rapid reversals preserve current visual state", async () => {
    const view = (active: boolean) => <Transition active={active} from="opacity-0 translate-y-2" to="opacity-100 translate-y-0" timing="500ms linear"><input defaultValue="Retained" /></Transition>;
    await render(view(true)); const input = q('input'), layer = q('[data-slot="motion"]'); await wait(80);
    const before = Number(getComputedStyle(layer).opacity);
    await render(view(false)); const after = Number(getComputedStyle(layer).opacity);
    if (!reduced) assert(Math.abs(before - after) < .25, "Interrupted exit jumped to a different opacity");
    await render(view(true)); await wait(600);
    assert(q('input') === input && getComputedStyle(layer).opacity === "1", "Rapid reversal lost state or final visibility");
    assert(q('.ui-motion').dataset.motionState === "entered", "Transition did not settle");
  });
  await check("Exit presence waits for completion and restores explicit focus", async () => {
    let change: (visible: boolean) => void = () => {};
    function Presence() {
      const [active, setActive] = useState(true), trigger = useRef<HTMLButtonElement>(null); change = setActive;
      return <><Button ref={trigger}>Outside trigger</Button><Transition active={active} duration={180} unmountOnExit exitFocusRef={trigger}><input aria-label="Inside presence" defaultValue="Draft" /></Transition></>;
    }
    await render(<Presence />); await wait(230); q<HTMLInputElement>('input').focus();
    flushSync(() => change(false));
    if (!reduced) assert(stage.querySelector('input'), "Content unmounted before its exit");
    await wait(250); assert(!stage.querySelector('input') && q('.ui-motion').inert, "Exiting content remained interactive/mounted");
    assert(document.activeElement === q('button'), "Exit focus target was not restored");
    flushSync(() => change(true)); await wait(250); assert(stage.querySelector('input'), "Exited content did not remount");
  });
  await check("Collapse measures auto height, closes to zero and preserves uncontrolled values", async () => {
    const view = (visible: boolean) => <Collapse visible={visible} duration={140}><input defaultValue="Draft" style={{ height: 48 }} /></Collapse>;
    await render(view(true)); await wait(220); const input = q<HTMLInputElement>('input'); input.value = "Remember me";
    assert(q('.ui-motion').getBoundingClientRect().height >= 48, "Collapse did not expand to content height");
    await render(view(false)); await wait(220); assert(q('.ui-motion').getBoundingClientRect().height < 1, "Collapse did not close to zero");
    await render(view(true)); await wait(240);
    assert(q('.ui-motion').getBoundingClientRect().height >= 48 && q('input') === input && input.value === "Remember me", "Collapse did not reopen/preserve state");
  });
  await check("Keyboard focus finishes pending entrances so focused content is never invisible", async () => {
    await render(scroller(<Fade duration={1000}><Button>Focusable entrance</Button></Fade>));
    const button = q<HTMLButtonElement>('button'); button.focus(); button.dispatchEvent(new FocusEvent("focusin", { bubbles: true })); await wait(50);
    assert(q('.ui-motion').dataset.motionState === "entered" && getComputedStyle(q('[data-slot="motion"]')).opacity === "1", "Keyboard focus remained invisible");
  });
  await check("Stagger has per-visible-item delays with a cap and no shared premature start", async () => {
    await render(<Stagger stagger={120} maxDelay={180} duration={500}>{[0, 1, 2, 3].map(index => <div key={index} style={{ height: 25 }}>Item {index}</div>)}</Stagger>);
    const animations = Array.from(stage.querySelectorAll<HTMLElement>('[data-slot="motion"]')).flatMap(node => node.getAnimations());
    if (!reduced) {
      assert(animations.length === 4, "Stagger did not animate each visible item");
      const delays = animations.map(animation => animation.effect!.getTiming().delay);
      assert(JSON.stringify(delays) === JSON.stringify([0, 120, 180, 180]), "Stagger delays are not capped correctly");
    }
  });
  await check("Dynamic reduced-motion, disabled and zero-duration modes settle without background loops", async () => {
    const original = window.matchMedia;
    class Preference extends EventTarget { matches = false; media = "(prefers-reduced-motion: reduce)"; }
    const preference = new Preference();
    try {
      window.matchMedia = ((query: string) => query === preference.media ? preference : original.call(window, query)) as typeof matchMedia;
      await render(<Float duration={250}>{content}</Float>);
      preference.matches = true; preference.dispatchEvent(new Event("change")); await wait(40);
      assert(q('.ui-motion').dataset.motionState === "entered" && q('[data-slot="motion"]').getAnimations().length === 0, "Reduced motion did not stop and reveal");
      preference.matches = false; preference.dispatchEvent(new Event("change")); await wait(60);
      assert(q('[data-slot="motion"]').getAnimations().length === 1, "Loop did not resume when reduced motion was removed");
      await render(<Slide disabled>{content}</Slide>); assert(q('.ui-motion').dataset.motionState === "entered", "Disabled motion did not settle");
      await render(<Float duration={0}>{content}</Float>); await wait(60);
      assert(q('[data-slot="motion"]').getAnimations().length === 0 && q('.ui-motion').dataset.motionState === "entered", "Zero-duration repeat started a loop");
    } finally { window.matchMedia = original; }
  });
  await check("Feature fallback and unmount cleanup preserve content and cancel observers/animations", async () => {
    const original = window.IntersectionObserver;
    try {
      Reflect.set(window, "IntersectionObserver", undefined);
      await render(<Animation>{content}</Animation>);
      assert(q('.ui-motion').dataset.motionState === "entered" && getComputedStyle(q('[data-slot="motion"]')).opacity === "1", "Observer fallback hid useful content");
    } finally { window.IntersectionObserver = original; }
    await render(<Float duration={300}>{content}</Float>);
    const view = q('.ui-motion'), layer = q('[data-slot="motion"]'), animations = layer.getAnimations();
    await render(<span>Unmounted</span>);
    assert(!view.hasAttribute("data-motion-enhanced") && animations.every(animation => animation.playState === "idle"), "Unmount leaked motion state/animations");
    assert(errors.length === 0, "Runtime errors: " + errors.join("; "));
  });
  const failures = results.filter(result => !result.passed);
  report.textContent = `${results.length} checks · ${failures.length} failures\n` + report.textContent;
  document.title = `Animation checks: ${results.length} run, ${failures.length} failed`;
  console.table(results); window.removeEventListener("error", capture);
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}
