/** On Astro dev: import('/tests/material-tabs.browser.tsx').then(m => m.runMaterialTabChecks()) */
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { useState, type ReactNode } from "react";
import { TabView } from "../src/_components/common/ohmygui/navigation/TabView";
import { TabBar } from "../src/_components/common/ohmygui/navigation/TabBar";
import { Tab } from "../src/_components/common/ohmygui/navigation/Tab";
import { MaterialSurface } from "../src/_components/common/ohmygui/drawing/MaterialSurface";
import { Dialog } from "../src/_components/common/ohmygui/presentation/Dialog";
import { FullScreenCover } from "../src/_components/common/ohmygui/presentation/FullScreenCover";
import { Popover } from "../src/_components/common/ohmygui/presentation/Popover";
import { Menu } from "../src/_components/common/ohmygui/presentation/Menu";
import { ContextMenu } from "../src/_components/common/ohmygui/presentation/ContextMenu";
import { Tooltip } from "../src/_components/common/ohmygui/presentation/Tooltip";
import { Toast } from "../src/_components/common/ohmygui/presentation/Toast";
import { Banner } from "../src/_components/common/ohmygui/presentation/Banner";
import { Sidebar } from "../src/_components/common/ohmygui/navigation/Sidebar";
import { Toolbar } from "../src/_components/common/ohmygui/navigation/Toolbar";
import { NavigationSplitView } from "../src/_components/common/ohmygui/navigation/NavigationSplitView";
import { Background } from "../src/_components/common/ohmygui/layout/Background";
import { Overlay } from "../src/_components/common/ohmygui/layout/Overlay";
import { Image } from "../src/_components/common/ohmygui/content/Image";
import { AsyncImage } from "../src/_components/common/ohmygui/content/AsyncImage";
import { Button } from "../src/_components/common/ohmygui/control/button/Button";

export async function runMaterialTabChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.id = "material-tab-checks";
  host.style.cssText = "position:fixed;inset:8px;z-index:2147483647;overflow:auto;background:var(--background);color:var(--foreground);padding:16px;font:13px system-ui";
  stage.style.cssText = "width:640px;max-width:100%;min-height:160px;background:repeating-linear-gradient(45deg,#bb86fc 0 24px,#397c5a 24px 48px);padding:12px";
  host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [];
  const wait = (ms = 50) => new Promise<void>(resolve => setTimeout(resolve, ms));
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const q = <T extends HTMLElement = HTMLElement>(selector: string) => { const element = stage.querySelector<T>(selector); if (!element) throw new Error("Missing " + selector); return element; };
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const check = async (name: string, test: () => Promise<void>) => {
    try { await test(); results.push({ name, passed: true }); }
    catch (error) { results.push({ name, passed: false, error: String(error) }); }
    report.textContent = results.map(result => `${result.passed ? "PASS" : "FAIL"} ${result.name}${result.error ? ": " + result.error : ""}`).join("\n");
  };
  const click = async (element: HTMLElement, delay = 35) => { flushSync(() => element.click()); await wait(delay); };
  const tabs = ["Home", "A longer collection", "Settings"].map((label, index) => ({ id: String(index), label, icon: <span>{index + 1}</span>, content: <Button>{label} action</Button> }));
  const aligned = () => {
    if (matchMedia("(forced-colors: active)").matches) {
      assert(getComputedStyle(q('[data-slot="selectionIndicator"]')).display === "none", "Forced colors should use the system selection, not the decorative lens");
      return;
    }
    const lens = q('[data-slot="selectionIndicator"]').getBoundingClientRect(), target = q('.ui-tab[aria-selected="true"], .ui-tab[aria-current="page"]').getBoundingClientRect();
    assert(Math.abs(lens.left - target.left) < 1.5 && Math.abs(lens.top - target.top) < 1.5 && Math.abs(lens.width - target.width) < 1.5 && Math.abs(lens.height - target.height) < 1.5, "Lens does not settle exactly on selected target");
  };
  const animated = !matchMedia("(prefers-reduced-motion: reduce)").matches && !matchMedia("(forced-colors: active)").matches;
  await check("One travelling lens: lift/stretch/overshoot, panel entrance, rapid retarget and settle", async () => {
    await render(<TabView tabs={tabs} />);
    assert(stage.querySelectorAll('[data-slot="selectionIndicator"]').length === 1, "Duplicate selection lenses"); aligned();
    const buttons = stage.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    await click(buttons[1]);
    const lens = q('[data-slot="selectionIndicator"]');
    const flight = lens.getAnimations().find(item => item.id === "ui-tab-flight");
    if (animated) {
      assert(flight, "No travelling selection animation");
      const frames = (flight!.effect as KeyframeEffect).getKeyframes();
      assert(frames.length >= 5 && frames.some(frame => String(frame.transform).includes("rotate")), "Lens has no expressive multi-stage trajectory");
      const start = lens.getBoundingClientRect(); await wait(110);
      assert(Math.abs(lens.getBoundingClientRect().left - start.left) > 2, "Lens is not actually moving");
      assert(q('[role="tabpanel"]:not([hidden])').getAnimations().some(item => item.id === "ui-tab-panel"), "Missing panel entrance");
    } else assert(!flight, "Reduced motion/forced colors must not fly");
    await click(buttons[2], 20); await click(buttons[0], 20); await click(buttons[2]); await wait(850); aligned();
    assert(!lens.hasAttribute("data-traveling") && lens.getAnimations().length === 0, "Completed animation was not cleaned up: " + JSON.stringify({ traveling: lens.dataset.traveling, animations: lens.getAnimations().map(item => ({ id: item.id, state: item.playState })) }));
    assert(getComputedStyle(lens).pointerEvents === "none" && lens.getAttribute("aria-hidden") === "true", "Lens intercepts input/accessibility");
  });
  await check("Vertical, RTL, resized and overflowing tabs remain aligned and keyboard accessible", async () => {
    await render(<div dir="rtl"><TabView tabs={tabs} orientation="vertical" /></div>);
    const button = q<HTMLButtonElement>('[role="tab"]'); button.focus();
    flushSync(() => button.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })));
    await wait(850); aligned();
    assert(q('[aria-selected="true"]').textContent?.includes("longer"), "Vertical arrow navigation failed");
    stage.style.width = "320px"; await render(<div dir="rtl"><TabView tabs={[...tabs, { id: "disabled", label: "Disabled", disabled: true, content: null }]} /></div>);
    const list = q('[role="tablist"]'); assert(list.scrollWidth >= list.clientWidth, "Invalid overflow geometry");
    await click(stage.querySelectorAll<HTMLButtonElement>('[role="tab"]')[2]); await wait(850); aligned();
    stage.style.width = "500px"; await wait(120); aligned();
    assert(q<HTMLButtonElement>('[role="tab"]:disabled').tabIndex === -1, "Disabled tab is focusable");
  });
  await check("Controlled route state animates without changing native URL semantics", async () => {
    function Routes() { const [active, setActive] = useState(0); return <><Button onClick={() => setActive(1)}>Change destination</Button><TabBar items={tabs.map((tab, index) => ({ ...tab, href: "#" + tab.id, current: active === index }))} /></>; }
    await render(<Routes />); await click(q('button')); await wait(850); aligned();
    assert(!stage.querySelector('[role="tablist"]') && q<HTMLAnchorElement>('a[aria-current="page"]').getAttribute("href") === "#1", "Route semantics changed");
  });
  await check("Standalone Tab composition shares and disposes its lens", async () => {
    function Composed() { const [active, setActive] = useState("a"); return <div role="tablist" className="ui-tab-list"><Tab id="motion-a" label="First" active={active === "a"} onClick={() => setActive("a")} /><Tab id="motion-b" label="Second" active={active === "b"} onClick={() => setActive("b")} /></div>; }
    await render(<Composed />); await click(q('[id="motion-b"]')); await wait(850); aligned();
    const old = q('[role="tablist"]'); await render(<span>Removed</span>);
    assert(!old.querySelector('[data-slot="selectionIndicator"]') && !old.hasAttribute("data-animated-selection"), "Lens/effects leaked after unmount");
  });
  const blurAllowed = CSS.supports("backdrop-filter", "blur(1px)") && !matchMedia("(prefers-reduced-transparency: reduce)").matches && !matchMedia("(forced-colors: active)").matches;
  await check("Material amounts, clamping, opaque opt-out, sharp children and nested-pass suppression", async () => {
    await render(<><MaterialSurface material={{ blur: "11px", opacity: 2 }}><TextNode /><MaterialSurface>Nested</MaterialSurface></MaterialSurface><MaterialSurface material={false}>Opaque</MaterialSurface></>);
    const surfaces = stage.querySelectorAll<HTMLElement>('[data-ui="MaterialSurface"]');
    assert(surfaces[0].style.getPropertyValue("--ui-material-opacity") === "100%", "Opacity is not clamped");
    assert(blurAllowed ? getComputedStyle(surfaces[0]).backdropFilter.includes("11px") : getComputedStyle(surfaces[0]).backdropFilter === "none", "Material filter/fallback incorrect");
    assert(getComputedStyle(surfaces[1]).backdropFilter === "none" && getComputedStyle(surfaces[2]).backdropFilter === "none", "Nested/disabled material still blurs");
    assert(getComputedStyle(q('button')).filter === "none", "Foreground button was blurred");
    host.classList.add("dark"); await wait(); assert(getComputedStyle(surfaces[2]).backgroundColor !== "rgba(0, 0, 0, 0)", "Dark opaque fallback is transparent"); host.classList.remove("dark");
  });
  await check("Unsupported-filter fallback stays opaque when enhancement rules are unavailable", async () => {
    const saved: { owner: CSSStyleSheet | CSSGroupingRule; index: number; text: string }[] = [];
    const collect = (owner: CSSStyleSheet | CSSGroupingRule) => {
      Array.from(owner.cssRules).forEach((rule, index) => {
        if (rule instanceof CSSSupportsRule && rule.conditionText.includes("backdrop-filter")) saved.push({ owner, index, text: rule.cssText });
        else if (rule instanceof CSSGroupingRule) collect(rule);
      });
    };
    for (const sheet of document.styleSheets) { try { collect(sheet); } catch { /* Ignore unrelated cross-origin sheets. */ } }
    assert(saved.length, "Material feature-query rules not found");
    try {
      [...saved].reverse().forEach(item => item.owner.deleteRule(item.index));
      await render(<MaterialSurface material={{ tint: "rgb(24, 48, 32)", opacity: .2 }}>Opaque fallback</MaterialSurface>);
      const style = getComputedStyle(q('[data-ui="MaterialSurface"]'));
      assert(style.backdropFilter === "none", "Fallback still has a filter");
      assert(style.backgroundColor === (matchMedia("(forced-colors: active)").matches ? getComputedStyle(host).backgroundColor : "rgb(24, 48, 32)"), "Fallback did not restore an opaque fill");
    } finally { saved.forEach(item => item.owner.insertRule(item.text, item.index)); }
  });
  await check("Panel-only blur: popover/menu/context menu/tooltip and notification surfaces", async () => {
    await render(<Popover material open trigger="Context" title="Details"><Button>Sharp action</Button></Popover>);
    assert(q('[data-slot="panel"]').dataset.material === "true" && getComputedStyle(q('[data-ui="Popover"]')).backdropFilter === "none", "Popover filters trigger/root");
    await render(<Menu material open trigger="Actions" items={[{ label: "Choose" }]} />);
    assert(q('[role="menu"]').dataset.material === "true" && document.activeElement?.getAttribute("role") === "menuitem", "Menu material broke focus");
    await render(<ContextMenu material items={[{ label: "Choose" }]} />); await click(q('[aria-haspopup="menu"]'));
    assert(q('[role="menu"]').dataset.material === "true", "ContextMenu did not delegate material");
    await render(<Tooltip material delay={0} content="Hint"><Button>Focus me</Button></Tooltip>);
    flushSync(() => { const trigger = q<HTMLButtonElement>('button'); trigger.focus(); trigger.dispatchEvent(new FocusEvent("focusin", { bubbles: true })); }); await wait(100);
    assert(q('[role="tooltip"]').dataset.material === "true", "Tooltip content is not the material owner");
    await render(<><Toast material duration={0} message="Saved" /><Banner material title="Status">Ready</Banner></>);
    assert(stage.querySelectorAll('.ui-material[data-material="true"]').length === 2, "Notification material missing");
  });
  await check("Navigation material stays on chosen chrome/panes", async () => {
    await render(<><Sidebar material items={[]} /><Toolbar material><Button>Action</Button></Toolbar><NavigationSplitView viewport={false} style={{ height: 220 }} sidebar="Sidebar" content="Content" paneMaterials={{ sidebar: { blur: "9px" } }} /></>);
    assert(q('[data-ui="Sidebar"]').dataset.material === "true" && q('[data-ui="Toolbar"]').dataset.material === "true", "Navigation chrome material missing");
    assert(q('[data-split-pane][data-slot="sidebar"]').dataset.material === "true" && q('[data-split-pane][data-slot="content"]').dataset.material === "false", "Split applies material outside requested pane");
    assert(getComputedStyle(q('[data-ui="NavigationSplitView"]')).backdropFilter === "none", "Entire split is filtered");
  });
  await check("Nested native dialogs share one backdrop and preserve focus/scroll restoration", async () => {
    const overflow = document.body.style.overflow;
    await render(<><Dialog open title="Parent"><Button>Parent action</Button></Dialog><Dialog open title="Child" backdropMaterial={{ blur: "9px", opacity: .4 }}><Button autoFocus>Child action</Button></Dialog></>);
    const dialogs = stage.querySelectorAll<HTMLDialogElement>('dialog');
    assert(dialogs[0].hasAttribute("data-under-modal") && !dialogs[1].hasAttribute("data-under-modal"), "Nested dialogs both own the backdrop");
    assert(getComputedStyle(dialogs[0], "::backdrop").backdropFilter === "none", "Underlying modal still blurs");
    assert(blurAllowed ? getComputedStyle(dialogs[1], "::backdrop").backdropFilter.includes("9px") : getComputedStyle(dialogs[1], "::backdrop").backdropFilter === "none", "Configured modal backdrop mismatch");
    assert(dialogs[1].contains(document.activeElement) && dialogs[1].matches(":modal"), "Top dialog lost native modal focus");
    await render(<FullScreenCover open title="Opaque cover"><Button>Close</Button></FullScreenCover>);
    assert(q('dialog').dataset.backdropMaterial === "false", "Full-screen cover wastes a hidden blur pass");
    await render(<span>Closed</span>); assert(document.body.style.overflow === overflow, "Scroll lock leaked");
    function FocusCycle() { const [open, setOpen] = useState(false); return <><Button data-cycle-trigger="" onClick={() => setOpen(true)}>Open focus cycle</Button><Dialog open={open} onClose={() => setOpen(false)} title="Focus cycle"><Button autoFocus>Inside</Button></Dialog></>; }
    await render(<FocusCycle />);
    const trigger = q<HTMLButtonElement>('[data-cycle-trigger]'); trigger.focus(); await click(trigger);
    assert(q('dialog').contains(document.activeElement), "Dialog did not receive focus");
    await click(q('[data-slot="close"]'));
    await wait(180); // Native focus/scroll restore after the fast modal exit.
    assert(document.activeElement === trigger && document.body.style.overflow === overflow, "Modal close did not restore trigger focus/scroll");
  });
  await check("Decorative background/overlay/thumbnail blur never filters readable content", async () => {
    await render(<><Background decorativeBlur="13px" image="linear-gradient(red, blue)"><Button>Readable</Button></Background><Overlay decorativeBlur="7px" overlay={<span>Decoration</span>}><Button>Foreground</Button></Overlay><Image src="/ohmygui/landscape.svg" alt="Useful image" decorativeBlur="8px" /><Image src="/ohmygui/landscape.svg" alt="" decorativeBlur="8px" /><AsyncImage src="/ohmygui/landscape.svg" loading="lazy" alt="Final image" placeholderSrc="/ohmygui/landscape.svg" placeholderBlur="10px" /></>);
    assert(getComputedStyle(q('[data-ui="Background"]')).filter === "none" && getComputedStyle(q('button')).filter === "none", "Background blurred foreground");
    assert(q('[data-slot="background"]').getAttribute("aria-hidden") === "true" && q('[data-slot="overlay"]').inert, "Decorative layers are accessible/interactive");
    assert(!q('img[alt="Useful image"]').classList.contains("ui-decorative-blur"), "Useful final image was blurred");
    assert(q('img[alt=""]').classList.contains("ui-decorative-blur"), "Decorative image is not opt-in filtered");
    const useful = q<HTMLImageElement>('[data-ui="AsyncImage"] > img'); useful.dispatchEvent(new Event("load")); await wait();
    assert(!stage.querySelector('[data-slot="thumbnail"]'), "Loading thumbnail was not removed on success");
    assert(getComputedStyle(useful).filter === "none", "Async final image was blurred");
    await render(<Overlay interactive decorativeBlur="12px" overlay={<Button>Interactive overlay</Button>}>Host</Overlay>);
    assert(!q('[data-slot="decoration"]').classList.contains("ui-decorative-blur"), "Interactive overlay was filtered");
  });
  const failures = results.filter(result => !result.passed);
  report.textContent = `${results.length} checks · ${failures.length} failures\n` + report.textContent;
  document.title = `Material/tab checks: ${results.length} run, ${failures.length} failed`;
  console.table(results);
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}

function TextNode() { return <Button>Always sharp</Button>; }
