/** One shared, interruptible selection lens per tab list (including composed Tab primitives). */
const lists = new WeakMap<HTMLElement, { count: number; dispose: () => void }>();

export function attachTabIndicator(list: HTMLElement) {
  const existing = lists.get(list);
  if (existing) { existing.count++; return () => release(list); }
  const indicator = document.createElement(list.tagName === "UL" ? "li" : "span");
  indicator.dataset.slot = "selectionIndicator";
  indicator.className = "ui-tab-indicator";
  indicator.setAttribute("aria-hidden", "true");
  indicator.setAttribute("role", "presentation");
  list.append(indicator);
  let selected: HTMLElement | null = null, animation: Animation | undefined, iconAnimation: Animation | undefined;
  let frame = 0;
  let geometry = "";
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const contrast = matchMedia("(forced-colors: active)");
  const measure = (travel = true) => {
    const next = Array.from(list.querySelectorAll<HTMLElement>('.ui-tab[aria-selected="true"], .ui-tab[aria-current="page"]'))
      .find(tab => tab.closest('[role="tablist"], .ui-tab-bar > ul') === list && !tab.matches(':disabled, [aria-disabled="true"]')) ?? null;
    if (!next || !next.getClientRects().length) {
      animation?.cancel(); indicator.hidden = true; delete list.dataset.animatedSelection; selected = null; return;
    }
    const old = selected && !indicator.hidden ? indicator.getBoundingClientRect() : null;
    const target = next.getBoundingClientRect(), bounds = list.getBoundingClientRect();
    const changed = selected !== next;
    const nextGeometry = [target.left - bounds.left + list.scrollLeft, target.top - bounds.top + list.scrollTop, target.width, target.height].join(",");
    if (!changed && geometry === nextGeometry) return;
    geometry = nextGeometry;
    selected = next;
    animation?.cancel();
    indicator.hidden = false;
    Object.assign(indicator.style, {
      left: `${target.left - bounds.left + list.scrollLeft - list.clientLeft}px`,
      top: `${target.top - bounds.top + list.scrollTop - list.clientTop}px`,
      width: `${target.width}px`, height: `${target.height}px`,
    });
    list.dataset.animatedSelection = "true";
    delete indicator.dataset.traveling;
    if (!old || !travel || !changed || motion.matches || contrast.matches || !indicator.animate) return;
    const dx = old.left + old.width / 2 - target.left - target.width / 2;
    const dy = old.top + old.height / 2 - target.top - target.height / 2;
    const sx = old.width / target.width, sy = old.height / target.height;
    const vertical = list.getAttribute("aria-orientation") === "vertical";
    const direction = Math.sign(vertical ? -dy : -dx);
    const distance = Math.hypot(dx, dy);
    indicator.dataset.traveling = "true";
    animation = indicator.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, offset: 0 },
      { transform: `translate(${dx * .82}px, ${dy * .82 - (vertical ? 0 : 5)}px) scale(${sx * (vertical ? 1.16 : 1.23)}, ${sy * (vertical ? 1.23 : 1.16)}) rotate(${-direction * 2}deg)`, offset: .2 },
      { transform: `translate(${vertical ? 0 : direction * 7}px, ${vertical ? direction * 7 : -2}px) scale(1.08, 1.04) rotate(${direction}deg)`, offset: .64 },
      { transform: "translate(0px, 0px) scale(.975, 1.025) rotate(0deg)", offset: .83 },
      { transform: "translate(0px, 0px) scale(1, 1) rotate(0deg)", offset: 1 },
    ], { id: "ui-tab-flight", duration: Math.min(760, 560 + distance * .35), easing: "cubic-bezier(.22,.75,.25,1)", fill: "both" });
    animation.onfinish = () => { delete indicator.dataset.traveling; animation?.cancel(); };
    iconAnimation?.cancel();
    const icon = next.querySelector<HTMLElement>('[data-slot="icon"]');
    iconAnimation = icon?.animate([
      { transform: "translateY(0) scale(1)" }, { transform: "translateY(-3px) scale(1.2)", offset: .48 }, { transform: "translateY(0) scale(1)" },
    ], { id: "ui-tab-symbol", duration: 500, easing: "cubic-bezier(.22,.75,.25,1)" });
  };
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => measure()); };
  const resize = new ResizeObserver(() => {
    if (selected?.matches('[aria-selected="true"], [aria-current="page"]')) measure(false);
  });
  const observeSizes = () => { resize.disconnect(); resize.observe(list); list.querySelectorAll<HTMLElement>(".ui-tab").forEach(tab => resize.observe(tab)); };
  const mutations = new MutationObserver(records => {
    // Ignore our own indicator/style changes. Re-observe when labels/icons/items change.
    if (records.every(record => record.target === indicator || indicator.contains(record.target))) return;
    if (records.some(record => record.type === "childList")) observeSizes();
    schedule();
  });
  mutations.observe(list, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected", "aria-current", "disabled", "aria-disabled", "dir"] });
  const preference = () => { animation?.cancel(); iconAnimation?.cancel(); delete indicator.dataset.traveling; geometry = ""; measure(false); };
  motion.addEventListener("change", preference); contrast.addEventListener("change", preference);
  observeSizes(); measure(false);
  lists.set(list, { count: 1, dispose: () => {
    cancelAnimationFrame(frame); resize.disconnect(); mutations.disconnect(); animation?.cancel(); iconAnimation?.cancel();
    motion.removeEventListener("change", preference); contrast.removeEventListener("change", preference);
    indicator.remove(); delete list.dataset.animatedSelection;
  } });
  return () => release(list);
}

function release(list: HTMLElement) {
  const entry = lists.get(list);
  if (entry && --entry.count === 0) { entry.dispose(); lists.delete(list); }
}
