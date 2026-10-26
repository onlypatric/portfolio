import { useLayoutEffect, useRef, useState, type RefObject } from "react";

export type PopupAnimationProps = { openingAnimation?: boolean; closingAnimation?: boolean };
type Options<T extends HTMLElement> = PopupAnimationProps & {
  panelRef: RefObject<T | null>; triggerRef?: RefObject<HTMLElement | null>;
  /** Manual native popover, with fixed viewport-clamped positioning when unavailable. */
  anchored?: boolean; matchTriggerWidth?: boolean; maxHeight?: number; onAfterClose?: () => void; onDismiss?: () => void;
  inert?: boolean; ariaHidden?: boolean | "true" | "false";
};

/** Retain the actual surface for exit; animate only transform/opacity, never layout or blur. */
export function usePopupMotion<T extends HTMLElement>(open: boolean, options: Options<T>) {
  const [held, setHeld] = useState(open), present = open || held;
  const latest = useRef({ ...options, open }); latest.current = { ...options, open };
  const stop = useRef<() => void>(() => {}), settle = useRef<() => void>(() => {}), running = useRef(false), lastOpen = useRef<boolean | undefined>(undefined);
  const reposition = useRef<() => void>(() => {});
  // Preparing the top layer precedes measuring/animating it. Keep it until exit settles.
  useLayoutEffect(() => {
    const { panelRef, triggerRef, anchored, matchTriggerWidth, maxHeight } = latest.current;
    const panel = panelRef.current;
    if (!present || !anchored || !panel) return;
    if (panel.parentElement?.closest('[hidden],[inert],dialog:not([open])')) { latest.current.onDismiss?.(); return; }
    const position = () => {
      const anchor = triggerRef?.current; if (!anchor) return;
      const rect = anchor.getBoundingClientRect(), width = Math.min(Math.max(matchTriggerWidth ? rect.width : 336, 160), Math.max(1, innerWidth - 24));
      panel.style.width = width + "px"; panel.style.maxHeight = Math.min(maxHeight ?? Infinity, Math.max(80, innerHeight - 24)) + "px";
      const height = panel.offsetHeight, rtl = getComputedStyle(anchor).direction === "rtl";
      panel.style.left = Math.max(12, Math.min(rtl ? rect.right - width : rect.left, innerWidth - width - 12)) + "px";
      panel.style.top = Math.max(12, rect.bottom + height + 8 <= innerHeight - 12 ? rect.bottom + 8 : rect.top - height - 8) + "px";
    };
    if (latest.current.open && panel.dataset.popupState === "closed") panel.hidden = false;
    if (typeof panel.showPopover === "function" && panel.hasAttribute("popover") && !panel.matches(":popover-open")) {
      try { panel.showPopover(); } catch { panel.removeAttribute("popover"); }
    }
    reposition.current = position;
    position(); window.addEventListener("resize", position); window.addEventListener("scroll", position, true);
    // Manual top-layer children must not outlive a closing/hidden/inert owner.
    const ancestorVisibility = new MutationObserver(() => {
      if (latest.current.open && panel.parentElement?.closest('[hidden],[inert],dialog:not([open])')) latest.current.onDismiss?.();
    });
    for (let owner = panel.parentElement; owner; owner = owner.parentElement) ancestorVisibility.observe(owner, { attributes: true, attributeFilter: ["hidden", "inert", "open"] });
    return () => {
      window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true);
      ancestorVisibility.disconnect();
      reposition.current = () => {};
      if (typeof panel.hidePopover === "function" && panel.matches(":popover-open")) panel.hidePopover();
    };
  }, [present, options.anchored, options.matchTriggerWidth, options.maxHeight]);
  useLayoutEffect(() => () => { stop.current(); lastOpen.current = undefined; }, []);
  useLayoutEffect(() => {
    const panel = options.panelRef.current;
    if (!panel || (!open && !held)) return;
    const enabled = open ? options.openingAnimation !== false : options.closingAnimation !== false;
    // Opt-out changes settle an active effect; ordinary rerenders never restart one.
    if (lastOpen.current === open) { if (!enabled && running.current) settle.current(); return; }
    lastOpen.current = open;
    if (open) setHeld(true);
    if (open && panel.dataset.popupState === "closed") {
      panel.hidden = false;
      if (options.anchored && typeof panel.showPopover === "function" && panel.hasAttribute("popover") && !panel.matches(":popover-open")) {
        try { panel.showPopover(); } catch { panel.removeAttribute("popover"); }
      }
      reposition.current();
    }
    const snapshot = running.current ? getComputedStyle(panel) : null;
    const current = snapshot ? { transform: snapshot.transform, opacity: snapshot.opacity, origin: snapshot.transformOrigin } : null;
    stop.current();
    if (!open && panel.contains(document.activeElement)) options.triggerRef?.current?.focus({ preventScroll: true });
    panel.inert = !open || !!options.inert;
    if (open && options.ariaHidden === undefined) panel.removeAttribute("aria-hidden"); else panel.setAttribute("aria-hidden", open ? String(options.ariaHidden) : "true");
    panel.dataset.popupMotion = "";
    panel.dataset.popupState = open ? "opening" : "closing";
    const quiet = matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)");
    let animation: Animation | undefined, disposed = false;
    const originalOrigin = panel.style.transformOrigin;
    const cleanup = () => {
      if (disposed) return; disposed = true; running.current = false;
      if (animation) { animation.onfinish = null; animation.oncancel = null; animation.cancel(); }
      panel.style.transformOrigin = originalOrigin;
      quiet.removeEventListener("change", preference); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("resize", finish);
    };
    const finish = () => {
      if (disposed) return;
      // Hide synchronously before cancelling fill:both, avoiding a one-frame flash
      // while React schedules the retained subtree's removal.
      if (!open) panel.hidden = true;
      cleanup(); panel.dataset.popupState = open ? "open" : "closed";
      if (!open) { setHeld(false); latest.current.onAfterClose?.(); }
    };
    settle.current = finish;
    const preference = () => { if (quiet.matches) finish(); };
    const visibility = () => { if (document.visibilityState === "hidden") finish(); };
    stop.current = cleanup;
    const style = getComputedStyle(panel), token = style.getPropertyValue(open ? "--ui-duration-normal" : "--ui-duration-fast").trim(), parsed = parseFloat(token);
    const duration = Number.isFinite(parsed) ? Math.max(0, parsed * (token.endsWith("ms") ? 1 : 1000)) : open ? 220 : 150;
    if (!enabled || quiet.matches || !duration || document.visibilityState === "hidden" || typeof panel.animate !== "function") { finish(); return; }
    const rect = panel.getBoundingClientRect(), anchor = options.triggerRef?.current;
    if (!rect.width || !rect.height || rect.bottom <= 0 || rect.right <= 0 || rect.top >= innerHeight || rect.left >= innerWidth || panel.parentElement?.closest('[hidden],[inert],dialog:not([open])')) { finish(); return; }
    const source = anchor?.isConnected ? anchor.getBoundingClientRect() : null;
    const usable = source && source.width && source.height && source.bottom > 0 && source.right > 0 && source.top < innerHeight && source.left < innerWidth;
    const origin = current?.origin ?? (usable ? `${source.left + source.width / 2 - rect.left}px ${source.top + source.height / 2 - rect.top}px` : "50% 50%");
    const base = style.transform === "none" ? "" : " " + style.transform;
    const rest = { transform: `scale(1)${base}`, opacity: style.opacity }, collapsed = { transform: `scale(.92)${base}`, opacity: 0 };
    panel.style.transformOrigin = origin;
    const frames: Keyframe[] = open ? [collapsed, rest] : [rest, collapsed];
    if (current) frames[0] = { transform: current.transform, opacity: current.opacity };
    const curve = style.getPropertyValue("--ui-ease").trim();
    try { animation = panel.animate(frames, { id: open ? "ui-popup-open" : "ui-popup-close", duration, fill: "both", easing: curve && CSS.supports("animation-timing-function", curve) ? curve : "ease-out" }); }
    catch { finish(); return; }
    running.current = true; animation.onfinish = finish; animation.oncancel = finish;
    quiet.addEventListener("change", preference); document.addEventListener("visibilitychange", visibility); window.addEventListener("resize", finish);
    // Used by independent opt-outs without discarding a pending exit.
    stop.current = () => { cleanup(); };
  }, [open, options.openingAnimation, options.closingAnimation]);
  return { present };
}
