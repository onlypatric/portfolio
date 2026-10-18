/** Focused real-DOM checks: import('/tests/split-view.browser.tsx').then(m => m.runSplitViewChecks()) */
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { NavigationSplitView } from "../src/_components/common/ohmygui/navigation/NavigationSplitView";

export async function runSplitViewChecks() {
  const host = document.createElement("section");
  host.style.cssText = "position:fixed;inset:12px auto auto 12px;z-index:2147483647;width:1100px;background:white;color:black";
  document.body.append(host);
  const root = createRoot(host), results: { name: string; passed: boolean; error?: string }[] = [];
  const key = "split-regression-" + crypto.randomUUID(), storageKey = "ohmygui:split-sidebar:v1:" + key;
  const settle = () => new Promise<void>(resolve => setTimeout(resolve, 50));
  const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
  const pane = (name: string) => host.querySelector<HTMLElement>(`[data-split-pane][data-slot="${name}"]`)!;
  const check = async (name: string, test: () => Promise<void>) => {
    try { await test(); results.push({ name, passed: true }); }
    catch (error) { results.push({ name, passed: false, error: String(error) }); }
  };
  const render = async (options: { mount?: string; collapsed?: boolean; mobilePane?: "sidebar" | "content" | "detail"; destination?: number; animation?: boolean; storage?: string; sidebarHeight?: number } = {}) => {
    flushSync(() => root.render(<NavigationSplitView key={options.mount ?? "a"} viewport={false}
      style={{ height: 300 }} sidebarScrollKey={options.storage ?? key} collapsed={options.collapsed}
      mobilePane={options.mobilePane} paneAnimation={options.animation} detailTransitionKey={options.destination}
      sidebar={<div style={{ height: options.sidebarHeight ?? 1500 }}>Directory</div>}
      content={<div style={{ height: 1400 }}><input aria-label="Retained draft" defaultValue="Initial" /></div>}
      detail={<div style={{ height: 1200 }}>Destination {options.destination}</div>} />));
    await settle();
  };
  try {
    await check("Sidebar position survives an actual component remount without scrolling other panes", async () => {
      await render(); pane("sidebar").scrollTop = 475; pane("content").scrollTop = 180;
      // A pagehide flush also covers native link navigation, not only React unmounts.
      window.dispatchEvent(new Event("pagehide"));
      assert(JSON.parse(sessionStorage.getItem(storageKey)!).top === 475, "Navigation did not flush current scroll");
      await render({ mount: "b" });
      assert(pane("sidebar").scrollTop === 475, "Sidebar did not restore after remount");
      assert(pane("content").scrollTop === 0 && pane("detail").scrollTop === 0, "Destination scroll was incorrectly restored");
    });
    await check("Initially collapsed sidebar restores on reveal; separate keys stay isolated", async () => {
      await render({ mount: "c", collapsed: true });
      await render({ mount: "c", collapsed: false });
      await new Promise(resolve => setTimeout(resolve, 350));
      assert(pane("sidebar").scrollTop === 475, "Hidden sidebar overwrote or failed to restore saved scroll");
      await render({ mount: "d", storage: key + "-other" });
      assert(pane("sidebar").scrollTop === 0, "Independent split keys shared a scroll position");
    });
    await check("Destination motion retains DOM, field drafts and independent scroll", async () => {
      await render({ destination: 1 });
      const input = host.querySelector("input")!; input.value = "Draft survives";
      const content = pane("content"), detail = pane("detail"); content.scrollTop = 95; detail.scrollTop = 110;
      await new Promise(resolve => setTimeout(resolve, 350));
      await render({ destination: 2 });
      const quiet = matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(forced-colors: active)").matches;
      assert(quiet || detail.getAnimations().some(animation => animation.effect instanceof KeyframeEffect && animation.effect.getKeyframes().some(frame => String(frame.transform).includes("translate"))), "Detail has no destination animation");
      assert(!content.getAnimations().length, "Unchanged content restarted motion");
      assert(host.querySelector("input") === input && input.value === "Draft survives", "Destination update remounted children");
      assert(content.scrollTop === 95 && detail.scrollTop === 110, "Animation changed pane scroll");
      await render({ destination: 3, animation: false });
      assert(!detail.getAnimations().length, "Motion opt-out did not cancel playback");
    });
    await check("Compact sidebar waits until visible to restore; content and detail reveal motion", async () => {
      host.style.width = "360px";
      await render({ mount: "mobile", mobilePane: "content" });
      await render({ mount: "mobile", mobilePane: "sidebar" });
      assert(pane("sidebar").scrollTop === 475, "Compact sidebar lost its stored position");
      await render({ mount: "mobile", mobilePane: "detail" });
      assert(pane("sidebar").inert && !pane("detail").inert, "Reveal changed inert semantics");
      const quiet = matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(forced-colors: active)").matches;
      assert(quiet || pane("detail").getAnimations().length > 0, "Compact detail did not animate");
    });
    await check("Malformed storage is ignored", async () => {
      sessionStorage.setItem(storageKey + "-invalid", '{"top":"invalid","left":null}');
      await render({ mount: "invalid", storage: key + "-invalid", mobilePane: "sidebar" });
      assert(pane("sidebar").scrollTop === 0, "Malformed storage affected the sidebar");
    });
    await check("Delayed sidebar content restores once measurable; user input takes precedence", async () => {
      sessionStorage.setItem(storageKey + "-delayed", '{"top":800,"left":0}');
      await render({ mount: "delayed", storage: key + "-delayed", mobilePane: "sidebar", sidebarHeight: 350 });
      await render({ mount: "delayed", storage: key + "-delayed", mobilePane: "sidebar", sidebarHeight: 1500 });
      assert(pane("sidebar").scrollTop === 800, "Growing content never reached the saved position");
      await render({ mount: "interrupted", storage: key + "-delayed", mobilePane: "sidebar", sidebarHeight: 350 });
      pane("sidebar").dispatchEvent(new WheelEvent("wheel", { bubbles: true }));
      pane("sidebar").scrollTop = 10;
      await render({ mount: "interrupted", storage: key + "-delayed", mobilePane: "sidebar", sidebarHeight: 1500 });
      assert(pane("sidebar").scrollTop === 10, "Restoration overrode the user's scroll");
    });
    await check("Reduced motion and unavailable storage keep navigation usable", async () => {
      const originalMatch = window.matchMedia, get = Storage.prototype.getItem, set = Storage.prototype.setItem;
      try {
        window.matchMedia = query => {
          const media = originalMatch.call(window, query);
          if (query === "(prefers-reduced-motion: reduce)") Object.defineProperty(media, "matches", { value: true });
          return media;
        };
        Storage.prototype.getItem = function (name) { if (name.includes(key)) throw new DOMException("Blocked", "SecurityError"); return get.call(this, name); };
        Storage.prototype.setItem = function (name, value) { if (name.includes(key)) throw new DOMException("Blocked", "SecurityError"); set.call(this, name, value); };
        await render({ mount: "quiet", mobilePane: "detail", destination: 4 });
        await render({ mount: "quiet", mobilePane: "detail", destination: 5 });
        assert(!pane("detail").getAnimations().length && !pane("detail").inert, "Reduced-motion destination is animated or unavailable");
        window.dispatchEvent(new Event("pagehide"));
        flushSync(() => root.render(null));
      } finally { window.matchMedia = originalMatch; Storage.prototype.getItem = get; Storage.prototype.setItem = set; }
    });
  } finally {
    root.unmount(); host.remove();
    ["", "-other", "-invalid", "-delayed"].forEach(suffix => sessionStorage.removeItem(storageKey + suffix));
  }
  console.table(results);
  return { results, failures: results.filter(result => !result.passed) };
}
