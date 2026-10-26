/** The only repeating indicator motion: one compositor effect, paused whenever not visible. */
export function createProgressMotion(track: HTMLElement, fill: HTMLElement) {
  if (typeof IntersectionObserver === "undefined" || typeof fill.animate !== "function") return () => {};
  const quiet = matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)");
  let animation: Animation | undefined, intersecting = false, direction = "", active = true;
  const cancel = () => { animation?.cancel(); animation = undefined; };
  const reconcile = () => {
    if (!active) return;
    if (quiet.matches) { cancel(); return; }
    let visible = intersecting && document.visibilityState !== "hidden";
    for (let element: HTMLElement | null = track; visible && element; element = element.parentElement) {
      const style = getComputedStyle(element);
      if (element.matches('[hidden],[inert],[aria-hidden="true"]') || style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) visible = false;
    }
    const nextDirection = getComputedStyle(track).direction;
    if (animation && nextDirection !== direction) cancel();
    if (!animation && visible) {
      direction = nextDirection;
      const frames = [{ transform: "translateX(-100%)" }, { transform: "translateX(300%)" }];
      animation = fill.animate(direction === "rtl" ? frames.reverse() : frames, { id: "ui-progress-indeterminate", duration: 1400, iterations: Infinity, easing: "ease-in-out" });
    }
    if (animation) { if (visible) animation.play(); else animation.pause(); }
  };
  const intersection = new IntersectionObserver(entries => { const entry = entries[entries.length - 1]; intersecting = entry.isIntersecting && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0; reconcile(); });
  const ancestors = new MutationObserver(reconcile);
  for (let element: HTMLElement | null = track; element; element = element.parentElement) ancestors.observe(element, { attributes: true, attributeFilter: ["class", "style", "hidden", "inert", "aria-hidden", "dir"] });
  intersection.observe(track); quiet.addEventListener("change", reconcile); document.addEventListener("visibilitychange", reconcile);
  return () => { active = false; cancel(); intersection.disconnect(); ancestors.disconnect(); quiet.removeEventListener("change", reconcile); document.removeEventListener("visibilitychange", reconcile); };
}
