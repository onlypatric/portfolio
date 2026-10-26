import { useLayoutEffect, useRef, useState, type RefObject } from "react";

/** Animate the retained sidebar within its owner; never isolate or scroll-lock the page. */
export function useSplitMenu(root: RefObject<HTMLDivElement | null>, compact: boolean, open: boolean,
  animated: boolean, dismiss: () => void) {
  const [held, setHeld] = useState(false);
  const latest = useRef({ open, dismiss }); latest.current = { open, dismiss };
  const session = useRef<{ panel: HTMLElement; release: (focus: boolean) => void } | null>(null);
  const restore = useRef<{ previous: HTMLElement | null; panel: HTMLElement } | null>(null);
  const stop = useRef<() => void>(() => {});
  const playing = useRef(false);
  useLayoutEffect(() => () => { stop.current(); session.current?.release(false); }, []);
  useLayoutEffect(() => {
    const element = root.current;
    const panel = element?.querySelector<HTMLElement>(':scope > [data-slot="sidebar"]');
    if (!element || !panel) { stop.current(); session.current?.release(false); setHeld(false); return; }
    const current = playing.current ? getComputedStyle(panel).transform : undefined;
    stop.current();
    if (!compact) {
      session.current?.release(true); delete panel.dataset.menuState; setHeld(false); return;
    }
    if (!open && !session.current) return;
    if (open && !session.current) {
      if (element.closest("[hidden],[inert]")) { latest.current.dismiss(); return; }
      restore.current = null;
      setHeld(true); panel.dataset.menuState = "opening";
      const previous = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement : element.querySelector<HTMLElement>(':scope > [data-slot="controls"] > [data-pane="sidebar"]');
      const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]'))
        .filter(node => node.tabIndex >= 0 && !node.matches(":disabled") && !node.closest("[inert]") && node.getClientRects().length > 0);
      const focusFirst = () => (panel.querySelector<HTMLElement>('[data-slot="menuClose"]') ?? focusables()[0] ?? panel).focus({ preventScroll: true });
      const nativeModal = () => Array.from(document.querySelectorAll("dialog:modal")).some(dialog => !dialog.contains(element));
      const guard = (event: FocusEvent) => {
        // This is not a page-modal dialog: Tab and pointer focus may leave the split.
        if (latest.current.open && !panel.contains(event.target as Node) && !nativeModal() &&
          !(event.target as HTMLElement).closest('[data-mobile-menu="true"]')) latest.current.dismiss();
      };
      const observer = new MutationObserver(() => {
        if (!element.closest('[hidden],[inert],dialog:not([open])')) return;
        stop.current(); panel.dataset.menuState = "closed";
        session.current?.release(false); setHeld(false); latest.current.dismiss();
      });
      for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
        observer.observe(ancestor, { attributes: true, attributeFilter: ["hidden", "inert", "open"] });
      }
      document.addEventListener("focusin", guard);
      session.current = { panel, release: (restoreFocus) => {
        session.current = null;
        observer.disconnect();
        document.removeEventListener("focusin", guard);
        restore.current = restoreFocus ? { previous, panel } : null;
      } };
      focusFirst();
    }
    if (open && !panel.contains(document.activeElement)) panel.querySelector<HTMLElement>('[data-slot="menuClose"]')?.focus({ preventScroll: true });
    panel.dataset.menuState = open ? "opening" : "closing";
    const finish = () => {
      stop.current(); panel.dataset.menuState = open ? "open" : "closed";
      if (!open) { session.current?.release(true); setHeld(false); }
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"), forced = matchMedia("(forced-colors: active)");
    const styles = getComputedStyle(element), token = styles.getPropertyValue("--ui-duration-normal").trim();
    const duration = parseFloat(token) * (token.endsWith("ms") ? 1 : 1000);
    if (!animated || reduced.matches || forced.matches || document.hidden || typeof panel.animate !== "function" || !Number.isFinite(duration) || duration <= 0) { finish(); return; }
    const outside = `translateX(${styles.direction === "rtl" ? "100%" : "-100%"})`;
    const animation = panel.animate([
      { transform: current ?? (open ? outside : "translateX(0)") },
      { transform: open ? "translateX(0)" : outside },
    ], { duration, easing: styles.getPropertyValue("--ui-ease").trim() || "ease-out", fill: "both" });
    playing.current = true;
    const visibility = () => { if (document.hidden) finish(); };
    stop.current = () => {
      animation.onfinish = null; animation.oncancel = null; animation.cancel(); playing.current = false;
      reduced.removeEventListener("change", finish); forced.removeEventListener("change", finish);
      window.removeEventListener("resize", finish); document.removeEventListener("visibilitychange", visibility);
      stop.current = () => {};
    };
    animation.onfinish = finish;
    animation.oncancel = finish;
    reduced.addEventListener("change", finish); forced.addEventListener("change", finish);
    window.addEventListener("resize", finish); document.addEventListener("visibilitychange", visibility);
  }, [root, compact, open, animated]);
  const present = compact && (open || held);
  useLayoutEffect(() => {
    if (present || !restore.current || !root.current) return;
    const { previous, panel } = restore.current; restore.current = null;
    const active = document.activeElement, element = root.current;
    // Wait for React to release inert controls, and respect caller-directed focus.
    if (active !== document.body && active !== panel && !panel.contains(active)) return;
    const usable = (node: HTMLElement | null) => node?.isConnected && !node.closest("[inert]") && !node.matches(":disabled") && node.getClientRects().length;
    const fallback = Array.from(element.querySelectorAll<HTMLElement>(':scope > [data-slot="controls"] > button')).find(node => usable(node));
    (usable(previous) ? previous! : fallback ?? element).focus({ preventScroll: true });
  });
  return present;
}
