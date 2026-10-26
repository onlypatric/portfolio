type Rect = Pick<DOMRectReadOnly, "left" | "top" | "width" | "height">;

/** Uniform scale avoids stretching text while the surface travels from its opener. */
export function modalOpeningFrames(source: Rect | null, target: Rect, transform = "none"): Keyframe[] {
  const x = source ? source.left + source.width / 2 - target.left - target.width / 2 : 0;
  const y = source ? source.top + source.height / 2 - target.top - target.height / 2 : 12;
  const scale = source ? Math.max(.15, Math.min(.85, Math.max(source.width / target.width, source.height / target.height))) : .96;
  const base = transform === "none" ? "" : " " + transform;
  return [
    { opacity: 0, transform: `translate(${x}px, ${y}px) scale(${scale})${base}`, transformOrigin: "center" },
    { opacity: 1, transform: `translate(0px, 0px) scale(1)${base}`, transformOrigin: "center" },
  ];
}

export function modalTriggerRect(trigger: HTMLElement | null): DOMRect | null {
  if (!trigger?.isConnected || trigger === document.body || trigger === document.documentElement || trigger.closest("[hidden], [inert]")) return null;
  const rect = trigger.getBoundingClientRect(), style = getComputedStyle(trigger);
  if (!rect.width || !rect.height || rect.bottom <= 0 || rect.right <= 0 || rect.top >= innerHeight || rect.left >= innerWidth || style.visibility === "hidden" || style.display === "none") return null;
  for (let element: HTMLElement | null = trigger; element; element = element.parentElement) {
    const appearance = getComputedStyle(element);
    if (appearance.visibility === "hidden" || appearance.display === "none" || Number(appearance.opacity) === 0) return null;
  }
  return rect;
}

export function modalSnapshot(dialog: HTMLDialogElement): Keyframe {
  const style = getComputedStyle(dialog);
  return { transform: style.transform, opacity: style.opacity, transformOrigin: style.transformOrigin };
}

/** Boundary-only geometry reads, then compositor-friendly properties. No JS frame loop. */
export function animateModal(dialog: HTMLDialogElement, source: Rect | null, { closing = false, current, enabled = true, complete }: { closing?: boolean; current?: Keyframe; enabled?: boolean; complete?: () => void } = {}) {
  const skip = () => { complete?.(); return () => {}; };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  if (!enabled || reduced.matches || document.visibilityState === "hidden" || typeof dialog.animate !== "function") return skip();
  const style = getComputedStyle(dialog), token = style.getPropertyValue(closing ? "--ui-duration-fast" : "--ui-duration-slow").trim();
  const value = parseFloat(token);
  const duration = Number.isFinite(value) ? Math.max(0, value * (token.endsWith("ms") ? 1 : 1000)) : closing ? 150 : 350;
  if (!duration) return skip();
  const target = dialog.getBoundingClientRect();
  if (!target.width || !target.height) return skip();
  const curve = style.getPropertyValue("--ui-ease").trim();
  const frames = modalOpeningFrames(source, target, style.transform);
  if (closing) frames.reverse();
  if (current) frames[0] = current;
  const animation = dialog.animate(frames, {
    id: closing ? "ui-modal-close" : "ui-modal-open", duration, easing: curve && CSS.supports("animation-timing-function", curve) ? curve : "ease-out", fill: "both",
  });
  const attribute = closing ? "closing" : "opening";
  dialog.dataset[attribute] = "true";
  let stopped = false;
  const cancel = () => {
    if (stopped) return;
    stopped = true;
    animation.onfinish = null; animation.cancel(); delete dialog.dataset[attribute];
    reduced.removeEventListener("change", preference);
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("resize", finish);
  };
  const finish = () => { if (!stopped) { cancel(); complete?.(); } };
  const preference = () => { if (reduced.matches) finish(); };
  const visibility = () => { if (document.visibilityState === "hidden") finish(); };
  animation.onfinish = finish;
  reduced.addEventListener("change", preference);
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("resize", finish);
  return cancel;
}
