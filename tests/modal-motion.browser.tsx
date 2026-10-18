/** On Astro dev: import('/tests/modal-motion.browser.tsx').then(m => m.runModalMotionChecks()) */
import { useRef, useState, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Button } from "../src/_components/common/ohmygui/control/button/Button";
import { ModalSurface, type ModalSurfaceProps } from "../src/_components/common/ohmygui/presentation/ModalSurface";
import { Dialog } from "../src/_components/common/ohmygui/presentation/Dialog";
import { Sheet } from "../src/_components/common/ohmygui/presentation/Sheet";
import { Inspector } from "../src/_components/common/ohmygui/presentation/Inspector";
import { FullScreenCover } from "../src/_components/common/ohmygui/presentation/FullScreenCover";
import { ConfirmationDialog } from "../src/_components/common/ohmygui/presentation/ConfirmationDialog";
import { CommandPalette } from "../src/_components/common/ohmygui/presentation/CommandPalette";
import { modalTriggerRect } from "../src/_components/common/ohmygui/presentation/_modal-motion";

export async function runModalMotionChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:var(--background);color:var(--foreground);padding:20px;overflow:auto";
  host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [];
  const errors: string[] = [], originalOverflow = document.body.style.overflow;
  const capture = (event: ErrorEvent) => errors.push(event.message); window.addEventListener("error", capture);
  const wait = (ms = 30) => new Promise(resolve => setTimeout(resolve, ms));
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const until = async (condition: () => boolean, message: string) => {
    const start = performance.now();
    while (!condition() && performance.now() - start < 2000) await wait();
    assert(condition(), message);
  };
  const render = async (node: React.ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const q = <T extends HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const dialog = () => q<HTMLDialogElement>("dialog");
  const motion = () => dialog().getAnimations().find(item => item.id === "ui-modal-open");
  const exitMotion = () => dialog().getAnimations().find(item => item.id === "ui-modal-close");
  let changeOpen: (value: boolean) => void;
  const close = async () => { q<HTMLButtonElement>('[data-slot="close"]').click(); await wait(); };
  const check = async (name: string, run: () => Promise<void>) => {
    try { await run(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); }
    await render(null);
    assert(document.body.style.overflow === originalOverflow, "Scroll lock leaked after " + name);
    report.textContent = results.map(item => `${item.passed ? "PASS" : "FAIL"} ${item.name}${item.error ? ": " + item.error : ""}`).join("\n");
  };
  function Fixture({ Surface = Dialog, explicit = true, conditional = false, openingAnimation = true, closingAnimation = false }: { Surface?: ComponentType<ModalSurfaceProps>; explicit?: boolean; conditional?: boolean; openingAnimation?: boolean; closingAnimation?: boolean }) {
    const [open, setOpen] = useState(false), trigger = useRef<HTMLButtonElement>(null);
    changeOpen = setOpen;
    return <><Button ref={trigger} data-trigger="" style={{ marginInlineStart: 15, marginBlockStart: 35 }} onClick={() => setOpen(true)}>Open prompt</Button>
      {(!conditional || open) && <Surface open={open} triggerRef={explicit ? trigger : undefined} openingAnimation={openingAnimation} closingAnimation={closingAnimation} title="Prompt" onClose={() => setOpen(false)} style={{ "--ui-duration-slow": "600ms" }}><input aria-label="Draft" autoFocus defaultValue="Keep this" /><Button>Inside</Button></Surface>}</>;
  }
  const variants: ComponentType<ModalSurfaceProps>[] = [ModalSurface, Dialog, props => <Sheet {...props} placement="bottom" />, props => <Inspector {...props} placement="end" />, FullScreenCover,
    props => <ConfirmationDialog {...props} choices={[{ label: "Keep it" }]} />,
    props => <CommandPalette {...props} commands={[]} />];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  await check("All seven modal variants inherit trigger-centered opening and native focus/backdrop behavior", async () => {
    for (const Surface of variants) {
      await render(<Fixture key={variants.indexOf(Surface)} Surface={Surface} />);
      const trigger = q<HTMLButtonElement>('[data-trigger]'), source = trigger.getBoundingClientRect();
      trigger.focus(); trigger.click(); await wait();
      const node = dialog(); assert(node.matches(":modal") && node.contains(document.activeElement), "Native modal/focus missing");
      assert(getComputedStyle(node, "::backdrop").transform === "none", "Backdrop travels with panel");
      const animation = motion();
      if (!reduced) {
        assert(animation, "Opening animation missing"); animation!.pause(); await animation!.ready; animation!.currentTime = 0;
        const start = node.getBoundingClientRect();
        assert(Math.abs(start.left + start.width / 2 - source.left - source.width / 2) < 2, "Opening X does not originate at trigger");
        assert(Math.abs(start.top + start.height / 2 - source.top - source.height / 2) < 2, "Opening Y does not originate at trigger");
        animation!.finish();
        await until(() => !motion() && !node.hasAttribute("data-opening"), `Variant ${variants.indexOf(Surface)} finished animation holds styles`);
      } else assert(!animation, "Reduced motion still animates");
      await close(); assert(document.activeElement === trigger, "Trigger focus not restored");
    }
  });
  await check("Focused opener is inferred automatically; each re-open creates fresh motion and close cancels immediately", async () => {
    await render(<Fixture explicit={false} />);
    const trigger = q<HTMLButtonElement>('[data-trigger]');
    let previous: Animation | undefined;
    for (let index = 0; index < 3; index++) {
      trigger.focus(); trigger.click(); await wait();
      const animation = motion();
      if (!reduced) { assert(animation && animation !== previous, "Reopen did not restart"); previous = animation; }
      await close(); assert(!dialog().open && document.activeElement === trigger, "Close delayed for decoration");
      assert(!animation || animation.playState === "idle", "Closed modal animation leaked");
    }
  });
  await check("Conditional mounts retain requested autofocus and explicit opener return; unmount cancels motion", async () => {
    await render(<Fixture conditional />);
    const trigger = q<HTMLButtonElement>('[data-trigger]'); trigger.click(); await wait();
    assert(dialog().contains(document.activeElement), "Conditional autofocus lost");
    const animation = motion(); await close();
    assert(!stage.querySelector("dialog") && document.activeElement === trigger, "Unmount did not restore opener");
    assert(!animation || animation.playState === "idle", "Unmount leaked animation");
  });
  await check("Escape, opt-out, natural completion and resize preserve immediate native semantics", async () => {
    await render(<Fixture openingAnimation={false} />); q<HTMLButtonElement>('[data-trigger]').click(); await wait();
    assert(!motion(), "Explicit opt-out animates"); dialog().dispatchEvent(new Event("cancel", { cancelable: true })); await wait();
    assert(!dialog().open, "Escape cancel did not dismiss");
    await render(<Fixture key="natural" />); q<HTMLButtonElement>('[data-trigger]').click(); await wait(680);
    assert(!motion() && dialog().matches(":modal"), "Natural completion changed open state or retained effect");
    await close(); q<HTMLButtonElement>('[data-trigger]').click(); await wait();
    window.dispatchEvent(new Event("resize")); await wait(); assert(!motion() && dialog().open, "Resize failed to settle");
  });
  await check("Missing/offscreen triggers fall back safely; nested dialogs keep one backdrop and input state", async () => {
    await render(<Button style={{ position: "fixed", left: -1000 }}>Hidden opener</Button>);
    assert(modalTriggerRect(q<HTMLButtonElement>("button")) === null, "Offscreen opener was accepted");
    await render(<div style={{ opacity: 0 }}><Button>Transparent opener</Button></div>);
    assert(modalTriggerRect(q<HTMLButtonElement>("button")) === null, "Transparent opener was accepted");
    await render(<Dialog open title="Programmatic" style={{ "--ui-duration-slow": "600ms" }}><input aria-label="Draft" defaultValue="Draft" /></Dialog>);
    const animation = motion();
    if (animation) assert(((animation.effect as KeyframeEffect).getKeyframes()[0].transform as string).includes("scale(0.96)"), "Missing trigger fallback incorrect");
    const input = q<HTMLInputElement>("input"); input.value = "Retained";
    await render(<Dialog open title="Changed" style={{ "--ui-duration-slow": "600ms" }}><input aria-label="Draft" defaultValue="Draft" /></Dialog>);
    assert(q<HTMLInputElement>("input") === input && input.value === "Retained" && motion() === animation, "Rerender restarted/remounted prompt");
    await render(<><Dialog open title="Parent"><Button>Parent</Button></Dialog><Dialog open title="Nested"><Button>Nested</Button></Dialog></>);
    const nodes = stage.querySelectorAll<HTMLDialogElement>("dialog");
    assert(nodes[0].hasAttribute("data-under-modal") && !nodes[1].hasAttribute("data-under-modal"), "Nested backdrop ownership lost");
  });
  await check("Scoped reduced-motion changes and unavailable WAAPI settle without blocking modal access", async () => {
    const original = window.matchMedia;
    const media = new EventTarget() as MediaQueryList;
    Object.defineProperty(media, "matches", { value: false, writable: true });
    window.matchMedia = (query: string) => query === "(prefers-reduced-motion: reduce)" ? media : original.call(window, query);
    try {
      await render(<Fixture />); q<HTMLButtonElement>('[data-trigger]').click(); await wait();
      assert(motion(), "Normal motion missing");
      Reflect.set(media, "matches", true); media.dispatchEvent(new Event("change")); await wait();
      assert(!motion() && dialog().matches(":modal"), "Preference change did not settle");
      await close(); q<HTMLButtonElement>('[data-trigger]').click(); await wait(); assert(!motion(), "Reduced motion animates on open");
    } finally { window.matchMedia = original; }
    const animate = Element.prototype.animate;
    Reflect.set(Element.prototype, "animate", undefined);
    try { await render(<Fixture key="fallback" />); q<HTMLButtonElement>('[data-trigger]').click(); await wait(); assert(dialog().matches(":modal"), "WAAPI fallback blocks dialog"); }
    finally { Element.prototype.animate = animate; }
    assert(!errors.length, errors.join("; "));
  });
  await check("All seven variants return to the live opener with one short transform/opacity effect", async () => {
    for (const Surface of variants) {
      await render(<Fixture key={variants.indexOf(Surface)} Surface={Surface} openingAnimation={false} closingAnimation />);
      const trigger = q<HTMLButtonElement>('[data-trigger]'); trigger.focus(); trigger.click(); await wait();
      trigger.style.marginInlineStart = "90px"; // Target is measured again at close, not stale opening geometry.
      const target = trigger.getBoundingClientRect();
      await close(); const node = dialog(), exit = exitMotion();
      if (!reduced) {
        assert(exit && node.matches(":modal") && node.inert, "Exit missing or controls remain active");
        exit!.pause(); await exit!.ready;
        const effect = exit!.effect as KeyframeEffect, frames = effect.getKeyframes();
        assert(Number(effect.getTiming().duration) <= 240, "Exit ignores fast timing token");
        assert(node.getAnimations().filter(item => item.id.startsWith("ui-modal-")).length === 1, "Multiple modal effects run together");
        assert(frames.every(frame => !Object.keys(frame).some(key => /^(height|width|filter|backdropFilter|left|top)$/.test(key))), "Exit animates layout or blur");
        assert(getComputedStyle(node, "::backdrop").transform === "none", "Backdrop moves during exit");
        exit!.currentTime = Number(effect.getTiming().duration);
        const end = node.getBoundingClientRect();
        assert(Math.abs(end.left + end.width / 2 - target.left - target.width / 2) < 2 && Math.abs(end.top + end.height / 2 - target.top - target.height / 2) < 2, "Exit misses live opener");
        exit!.finish();
      }
      await until(() => !node.open, "Exit did not release native dialog");
      assert(!exit || exit.playState === "idle", "Exit effect retained after closing");
      assert(!node.hasAttribute("data-closing") && !node.inert && document.activeElement === trigger && document.body.style.overflow === originalOverflow, "Exit leaked focus/inert/scroll state");
    }
  });
  await check("Rapid open-close-open is continuous and retains input state without cloning or per-frame geometry reads", async () => {
    await render(<Fixture closingAnimation />);
    const trigger = q<HTMLButtonElement>('[data-trigger]'); trigger.click(); await wait();
    const node = dialog(), input = q<HTMLInputElement>("input"); input.value = "Retained across reversal";
    if (!reduced) {
      const opening = motion()!; opening.pause(); await opening.ready; opening.currentTime = 240;
      const opacity = Number(getComputedStyle(node).opacity);
      flushSync(() => changeOpen(false));
      const exit = exitMotion()!; exit.pause(); await exit.ready; exit.currentTime = 0;
      assert(Math.abs(Number(getComputedStyle(node).opacity) - opacity) < .03, "Close jumps from partially open state");
      exit.currentTime = 60;
      const exitingOpacity = Number(getComputedStyle(node).opacity);
      flushSync(() => changeOpen(true));
      const reopening = motion()!; reopening.pause(); await reopening.ready; reopening.currentTime = 0;
      assert(Math.abs(Number(getComputedStyle(node).opacity) - exitingOpacity) < .03, "Reopen jumps from current exit position");
      reopening.finish(); await until(() => !motion(), "Reopen did not finish");
      assert(node.contains(document.activeElement) && !node.inert, "Reopen did not restore usable focus");
    }
    assert(q<HTMLInputElement>("input") === input && input.value === "Retained across reversal", "Reversal remounted form");
    let reads = 0, clones = 0;
    const originalRect = node.getBoundingClientRect, originalClone = node.cloneNode;
    node.getBoundingClientRect = function () { reads++; return originalRect.call(this); };
    node.cloneNode = function (deep) { clones++; return originalClone.call(this, deep); };
    try {
      flushSync(() => changeOpen(false)); const initialReads = reads;
      await wait(70);
      assert(reads === initialReads && clones === 0, "Exit performs frame-by-frame measurements or DOM cloning");
      await until(() => !node.open, "Final exit did not close");
    } finally { node.getBoundingClientRect = originalRect; node.cloneNode = originalClone; }
  });
  await check("Closing can be opted out or settled by resize/reduced motion; unmount cancels rather than orphaning DOM", async () => {
    await render(<Fixture closingAnimation />); q<HTMLButtonElement>('[data-trigger]').click(); await wait(); await close();
    window.dispatchEvent(new Event("resize")); await wait(); assert(!dialog().open, "Resize did not settle closing");
    await render(<Fixture key="unmount-exit" closingAnimation />); q<HTMLButtonElement>('[data-trigger]').click(); await wait(); await close();
    const exit = exitMotion(); await render(null);
    assert(!exit || exit.playState === "idle", "Unmount leaked an exit animation");
    const original = window.matchMedia, media = new EventTarget() as MediaQueryList;
    Object.defineProperty(media, "matches", { value: false, writable: true });
    window.matchMedia = query => query === "(prefers-reduced-motion: reduce)" ? media : original.call(window, query);
    try {
      await render(<Fixture key="reduce-exit" openingAnimation={false} closingAnimation />); q<HTMLButtonElement>('[data-trigger]').click(); await wait(); await close();
      assert(exitMotion(), "Normal exit missing"); Reflect.set(media, "matches", true); media.dispatchEvent(new Event("change")); await wait();
      assert(!dialog().open && !exitMotion(), "Reduced motion did not settle exit");
    } finally { window.matchMedia = original; }
    assert(!errors.length, errors.join("; "));
  });
  window.removeEventListener("error", capture);
  const failures = results.filter(item => !item.passed);
  console.table(results); document.title = `Modal motion: ${results.length} checks, ${failures.length} failed`;
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}
