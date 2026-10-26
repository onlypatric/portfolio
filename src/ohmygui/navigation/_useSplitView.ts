import { useLayoutEffect, useRef, type RefObject } from "react";
import type { NavigationPane } from "./NavigationSplitView";

/** Only the owning sidebar scrollport is saved, never nested splits or document scroll. */
export function useSplitSidebarScroll(root: RefObject<HTMLDivElement | null>, key: string | undefined, hasSidebar: boolean) {
  useLayoutEffect(() => {
    const sidebar = root.current?.querySelector<HTMLElement>(':scope > [data-slot="sidebar"]');
    if (!key || !hasSidebar || !sidebar) return;
    const storageKey = "ohmygui:split-sidebar:v1:" + key;
    let position = { top: 0, left: 0 }, pending = false;
    try {
      const value: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
      if (value && typeof value === "object" && "top" in value && "left" in value &&
        typeof value.top === "number" && Number.isFinite(value.top) && value.top >= 0 &&
        typeof value.left === "number" && Number.isFinite(value.left)) {
        position = { top: value.top, left: value.left }; pending = true;
      }
    } catch { /* Storage can be blocked or contain an older/invalid record. */ }
    const visible = () => sidebar.clientHeight > 0 && sidebar.clientWidth > 0 && !sidebar.inert;
    const observer = new ResizeObserver(() => restore());
    const restore = () => {
      // A compact/collapsed sidebar has no scroll geometry: wait until it is revealed.
      if (!pending || !visible()) return;
      sidebar.scrollTo({ top: position.top, left: position.left, behavior: "instant" });
      // Disclosures/async sidebar content may still be growing during hydration.
      pending = Math.abs(sidebar.scrollTop - position.top) > 1 || Math.abs(sidebar.scrollLeft - position.left) > 1;
      if (!pending) observer.disconnect();
    };
    const capture = () => {
      if (!pending && visible()) position = { top: sidebar.scrollTop, left: sidebar.scrollLeft };
    };
    const save = () => {
      capture();
      try { sessionStorage.setItem(storageKey, JSON.stringify(position)); } catch { /* Best effort. */ }
    };
    const visibility = () => { if (document.hidden) save(); };
    const interact = () => { pending = false; observer.disconnect(); capture(); };
    const inputEvents = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    if (pending) {
      observer.observe(sidebar);
      for (const child of sidebar.children) observer.observe(child);
    }
    restore();
    sidebar.addEventListener("scroll", capture, { passive: true });
    inputEvents.forEach(name => sidebar.addEventListener(name, interact, { passive: true }));
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      save(); observer.disconnect(); sidebar.removeEventListener("scroll", capture);
      inputEvents.forEach(name => sidebar.removeEventListener(name, interact));
      window.removeEventListener("pagehide", save); document.removeEventListener("visibilitychange", visibility);
    };
  }, [root, key, hasSidebar]);
}

/** Animate the real panes without remounting fields, cloning DOM, or animating layout. */
export function useSplitPaneMotion(root: RefObject<HTMLDivElement | null>, enhanced: boolean, compact: boolean,
  selected: NavigationPane, hasDetail: boolean, enabled: boolean,
  contentKey: string | number | undefined, detailKey: string | number | undefined) {
  const previous = useRef<{ compact: boolean; selected: NavigationPane; contentKey?: string | number; detailKey?: string | number; hasDetail: boolean } | null>(null);
  useLayoutEffect(() => {
    if (!enhanced || !root.current) return;
    const element = root.current, before = previous.current;
    previous.current = { compact, selected, contentKey, detailKey, hasDetail };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"), forced = matchMedia("(forced-colors: active)");
    if (!enabled || reduced.matches || forced.matches || document.hidden || element.closest("[inert],[hidden]")) return;
    const animations: Animation[] = [];
    const styles = getComputedStyle(element), token = styles.getPropertyValue("--ui-duration-normal").trim();
    const duration = Math.max(0, parseFloat(token) * (token.endsWith("ms") ? 1 : 1000));
    if (!Number.isFinite(duration) || duration === 0) return;
    const order: NavigationPane[] = ["sidebar", "content", "detail"];
    const direction = (before && order.indexOf(selected) < order.indexOf(before.selected) ? -1 : 1) * (styles.direction === "rtl" ? -1 : 1);
    for (const name of order) {
      if (compact && name === "sidebar") continue; // Full-screen menu owns its own entry/exit.
      const pane = element.querySelector<HTMLElement>(`:scope > [data-slot="${name}"]`);
      if (!pane || pane.inert || !pane.clientWidth || !pane.clientHeight || typeof pane.animate !== "function") continue;
      const revealed = before && (compact
        ? !before.compact || before.selected !== name
        : before.compact && before.selected !== name);
      const changed = name === "content" ? before?.contentKey !== contentKey : name === "detail" && (before?.detailKey !== detailKey || !before?.hasDetail);
      if (!revealed && !changed && (before || name === "sidebar")) continue;
      const animation = pane.animate([
        { opacity: 0, transform: compact ? `translateX(${direction * 12}px)` : "translateY(8px)" },
        { opacity: 1, transform: "none" },
      ], { duration, easing: styles.getPropertyValue("--ui-ease").trim() || "ease-out" });
      animations.push(animation);
    }
    const cancel = () => animations.forEach(animation => animation.cancel());
    const visibility = () => { if (document.hidden) cancel(); };
    reduced.addEventListener("change", cancel); forced.addEventListener("change", cancel);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancel(); reduced.removeEventListener("change", cancel); forced.removeEventListener("change", cancel);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [root, enhanced, compact, selected, hasDetail, enabled, contentKey, detailKey]);
}
