/** One decorative selection layer; native radios own focus, selection and form behavior. */
export function createSegmentedMotion(host: HTMLDivElement) {
  const indicator = host.querySelector<HTMLElement>('[data-slot="selectionIndicator"]')!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)");
  let animation: Animation | undefined, active = true, last = "", owner: HTMLFormElement | null = null;
  let observed = new Set<Element>();
  const cancel = () => { if (animation) { animation.onfinish = null; animation.cancel(); animation = undefined; } delete host.dataset.traveling; };
  const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => update(false));
  // Direction can change without resizing any option (for example an RTL app shell).
  const appearance = new MutationObserver(() => { last = ""; update(false); });
  for (let ancestor: HTMLElement | null = host; ancestor; ancestor = ancestor.parentElement) appearance.observe(ancestor, { attributes: true, attributeFilter: ["dir", "class", "style"] });
  const schedule = () => queueMicrotask(() => { if (active) update(true); });
  const reset = (event: Event) => queueMicrotask(() => { if (active && !event.defaultPrevented) update(true); });
  function update(animate = true) {
    if (!active) return;
    const nextOwner = host.querySelector<HTMLInputElement>("input")?.form ?? null;
    if (owner !== nextOwner) { owner?.removeEventListener("reset", reset); owner = nextOwner; owner?.addEventListener("reset", reset); }
    const targets = new Set<Element>([host, ...host.querySelectorAll('[data-slot="option"]')]);
    observed.forEach(target => { if (!targets.has(target)) observer?.unobserve(target); });
    targets.forEach(target => { if (!observed.has(target)) observer?.observe(target); }); observed = targets;
    const selected = host.querySelector<HTMLInputElement>('input:checked')?.closest<HTMLElement>('[data-slot="option"]');
    if (!selected || reduced.matches || typeof indicator.animate !== "function") {
      cancel(); delete host.dataset.selectionEnhanced; indicator.hidden = true; last = ""; return;
    }
    const root = host.getBoundingClientRect(), target = selected.getBoundingClientRect();
    if (!target.width || !target.height) { cancel(); delete host.dataset.selectionEnhanced; indicator.hidden = true; last = ""; return; }
    const x = target.left - root.left + host.scrollLeft - host.clientLeft, y = target.top - root.top + host.scrollTop - host.clientTop;
    const signature = [x, y, target.width, target.height].join(",");
    if (signature === last) return;
    const from = host.dataset.selectionEnhanced && !indicator.hidden ? indicator.getBoundingClientRect() : null;
    cancel(); last = signature;
    host.dataset.selectionEnhanced = "true"; indicator.hidden = false;
    indicator.style.width = target.width + "px"; indicator.style.height = target.height + "px";
    const transform = `translate(${x}px, ${y}px)`; indicator.style.transform = transform;
    const style = getComputedStyle(host), token = style.getPropertyValue("--ui-duration-fast").trim(), parsed = parseFloat(token);
    const duration = Number.isFinite(parsed) ? Math.max(0, parsed * (token.endsWith("ms") ? 1 : 1000)) : 150;
    if (!animate || !from || !duration || document.visibilityState === "hidden" || root.bottom <= 0 || root.top >= innerHeight || root.right <= 0 || root.left >= innerWidth || host.closest("[inert], [hidden]")) return;
    const curve = style.getPropertyValue("--ui-ease").trim();
    animation = indicator.animate([
      { transform: `translate(${from.left - root.left + host.scrollLeft - host.clientLeft}px, ${from.top - root.top + host.scrollTop - host.clientTop}px) scale(${from.width / target.width}, ${from.height / target.height})` },
      { transform },
    ], { id: "ui-segment-selection", duration, easing: curve && CSS.supports("animation-timing-function", curve) ? curve : "ease-out", fill: "both" });
    host.dataset.traveling = "true"; animation.onfinish = cancel;
  }
  const preference = () => { last = ""; update(false); };
  const visibility = () => { if (document.visibilityState === "hidden") cancel(); else { last = ""; update(false); } };
  host.addEventListener("change", schedule); reduced.addEventListener("change", preference); document.addEventListener("visibilitychange", visibility);
  return { update, dispose() {
    active = false; cancel(); observer?.disconnect(); appearance.disconnect(); observed.clear(); owner?.removeEventListener("reset", reset);
    host.removeEventListener("change", schedule); reduced.removeEventListener("change", preference); document.removeEventListener("visibilitychange", visibility);
    delete host.dataset.selectionEnhanced; indicator.hidden = true;
  } };
}
