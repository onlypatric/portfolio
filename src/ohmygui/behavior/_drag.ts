/** In-document drag coordination. No DOM work or shared user state during SSR. */
export type DragItemKey = string | number;
export const DRAG_MIME = "application/x-ohmygui-drag";
export type DragMethod = "native" | "pointer" | "keyboard";
export type DragItem = { itemKey: DragItemKey; dragKey: string; payload?: unknown; label: string; sourceId?: string };
export type ItemDrop = DragItem & { containerId: string; index: number; beforeKey?: DragItemKey; method: DragMethod };
type Source = DragItem & { element: HTMLElement; method: DragMethod };
type Target = { containerId: string; index: number };
type Snapshot = { source: Source | null; target: Target | null; message: string; announcementId?: string };
export type DragContainer = {
  id: string; element: HTMLElement; accepts: readonly string[]; disabled: boolean;
  orientation: "vertical" | "horizontal" | "grid";
  onDrop: (drop: ItemDrop) => void;
};
const idle: Snapshot = { source: null, target: null, message: "" };
let state = idle, release = () => {}, pending = () => {};
let pendingElement: HTMLElement | null = null;
const clickSuppression = new WeakMap<HTMLElement, number>();
export const validDragItemKey = (key: unknown): key is DragItemKey => typeof key === "string" || typeof key === "number" && Number.isFinite(key);
const listeners = new Set<() => void>(), containers = new Map<string, DragContainer>();
const publish = (next: Snapshot) => { state = next; listeners.forEach(listener => listener()); };
export const dragSnapshot = () => state;
export const dragServerSnapshot = () => idle;
export const subscribeDrag = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const compatible = (container: Pick<DragContainer, "accepts" | "disabled">, source = state.source) => !!source && !container.disabled && container.accepts.includes(source.dragKey);
export const dragItems = (container: DragContainer) => Array.from(container.element.querySelectorAll<HTMLElement>("[data-ui-drag-item]"))
  .filter(item => item.closest("[data-ui-drag-container]") === container.element);
export function registerDragContainer(container: DragContainer) {
  containers.set(container.id, container);
  return () => {
    if (containers.get(container.id) !== container) return;
    containers.delete(container.id);
    if (state.source?.sourceId === container.id) cancelDrag();
    else if (state.target?.containerId === container.id) setDragTarget(null);
  };
}
export function setDragTarget(target: Target | null) {
  if (target?.containerId === state.target?.containerId && target?.index === state.target?.index) return;
  const owner = target && containers.get(target.containerId);
  if (owner && !compatible(owner)) return;
  const origin = owner && state.source?.sourceId === owner.id ? dragItems(owner).indexOf(state.source.element) : -1;
  const position = target ? target.index + 1 - (origin >= 0 && origin < target.index ? 1 : 0) : 0;
  publish({ ...state, target, announcementId: owner ? owner.id : state.announcementId, message: owner ? `${state.source?.label}: position ${position} in ${owner.element.getAttribute("aria-label") ?? "destination"}.` : state.message });
}
export function focusDragTarget(element: HTMLElement) {
  if (state.source?.method !== "keyboard" || state.source.element === element) return;
  const node = element.closest("[data-ui-drag-container]"), owner = Array.from(containers.values()).find(container => container.element === node);
  if (owner && compatible(owner)) setDragTarget({ containerId: owner.id, index: dragItems(owner).indexOf(element) });
  else setDragTarget(null);
}
export function cancelDrag(message = "Move cancelled.") {
  pending(); release();
  if (state.source) publish({ source: null, target: null, message, announcementId: state.target?.containerId ?? state.source.sourceId });
}
export function releaseDragSource(element: HTMLElement | null) {
  if (pendingElement === element) pending();
  if (state.source?.element === element) cancelDrag();
}
export function startDrag(source: Source) {
  cancelDrag();
  const key = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); cancelDrag(); source.element.querySelector<HTMLElement>('[data-slot="dragHandle"]')?.focus({ preventScroll: true }); }
  };
  const blur = () => cancelDrag(), visibility = () => { if (document.hidden) cancelDrag(); };
  document.addEventListener("keydown", key, true); window.addEventListener("blur", blur);
  document.addEventListener("visibilitychange", visibility);
  release = () => {
    document.removeEventListener("keydown", key, true); window.removeEventListener("blur", blur);
    document.removeEventListener("visibilitychange", visibility); release = () => {};
  };
  publish({ source, target: null, announcementId: source.sourceId, message: `Picked up ${source.label}. Use arrow keys to choose a position, Tab to another destination, Enter to place, Escape to cancel.` });
  const owner = source.sourceId && containers.get(source.sourceId);
  if (owner && compatible(owner)) setDragTarget({ containerId: owner.id, index: Math.max(0, dragItems(owner).indexOf(source.element)) });
}
export function dropDrag() {
  const { source, target } = state, owner = target && containers.get(target.containerId);
  if (!source || !owner || !target || !compatible(owner) || !owner.element.isConnected || owner.element.closest("[hidden],[inert]") || !source.element.isConnected || source.element.closest("[hidden],[inert]") || !source.element.getClientRects().length) { cancelDrag(); return; }
  const index = Math.max(0, Math.min(dragItems(owner).length, target.index));
  const before = dragItems(owner)[index];
  const detail: ItemDrop = { itemKey: source.itemKey, dragKey: source.dragKey, payload: source.payload, label: source.label,
    sourceId: source.sourceId, containerId: owner.id, index,
    beforeKey: before ? keyForElement(before) : undefined, method: source.method };
  if (source.method === "keyboard") {
    const destination = source.sourceId === owner.id ? source.element.querySelector<HTMLElement>('[data-slot="dragHandle"]') : owner.element;
    destination?.focus({ preventScroll: true });
  }
  cancelDrag(`Placed ${source.label}.`);
  owner.onDrop(detail);
}
const keyForElement = (element: HTMLElement): DragItemKey => element.dataset.dragKeyType === "number" ? Number(element.dataset.itemKey) : element.dataset.itemKey!;
export function pointDragTarget(container: DragContainer, x: number, y: number) {
  if (!compatible(container)) return;
  const horizontal = container.orientation === "horizontal", rtl = getComputedStyle(container.element).direction === "rtl";
  const items = dragItems(container);
  const index = items.findIndex(item => {
    if (item === state.source?.element) return false;
    const rect = item.getBoundingClientRect();
    return horizontal ? rtl ? x > rect.left + rect.width / 2 : x < rect.left + rect.width / 2
      : container.orientation === "grid" && y >= rect.top && y <= rect.bottom ? rtl ? x > rect.left + rect.width / 2 : x < rect.left + rect.width / 2 : y < rect.top + rect.height / 2;
  });
  setDragTarget({ containerId: container.id, index: index < 0 ? items.length : index });
}
export function dragKeyboard(event: { key: string; preventDefault(): void; stopPropagation(): void }) {
  const { source, target } = state, owner = target && containers.get(target.containerId);
  if (!source || !owner || source.method !== "keyboard") return;
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); dropDrag(); return; }
  const horizontal = owner.orientation === "horizontal", rtl = getComputedStyle(owner.element).direction === "rtl";
  const next = horizontal ? rtl ? "ArrowLeft" : "ArrowRight" : "ArrowDown";
  const previous = horizontal ? rtl ? "ArrowRight" : "ArrowLeft" : "ArrowUp";
  if (![next, previous, "Home", "End"].includes(event.key)) return;
  event.preventDefault(); event.stopPropagation();
  const items = dragItems(owner), origin = source.sourceId === owner.id ? items.indexOf(source.element) : -1;
  let index = event.key === "Home" ? 0 : event.key === "End" ? items.length : target!.index + (event.key === next ? 1 : -1);
  if (origin >= 0 && index === origin + 1) index += event.key === next ? 1 : -1;
  setDragTarget({ containerId: owner.id, index: Math.max(0, Math.min(items.length, index)) });
}
export const pointerPending = () => pending !== noop;
const noop = () => {};
pending = noop;
export const suppressDragClick = (element: HTMLElement) => Date.now() < (clickSuppression.get(element) ?? 0);
export function pointerDrag(event: PointerEvent, source: Omit<Source, "method">, handle: HTMLElement) {
  if (event.button !== 0 || !event.isPrimary) return;
  pending();
  const { clientX: startX, clientY: startY, pointerId } = event;
  let started = false, preview: HTMLElement | null = null, frame = 0, x = startX, y = startY, lastFrame = 0;
  const hit = () => {
    const node = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-ui-drag-container]");
    const owner = node && Array.from(containers.values()).find(container => container.element === node);
    if (owner && compatible(owner)) pointDragTarget(owner, x, y); else setDragTarget(null);
  };
  const draw = (time: number) => {
    frame = 0;
    if (preview) preview.style.transform = `translate3d(${x + 12}px,${y + 12}px,0)`;
    hit();
    const step = Math.min(16, lastFrame ? (time - lastFrame) * .5 : 8); lastFrame = time;
    const destination = state.target && containers.get(state.target.containerId);
    if (!destination || !compatible(destination)) return;
    // Scroll the nearest bounded scrollport only while an active pointer rests at its edge.
    for (let node: HTMLElement | null = destination.element; node && node !== document.body; node = node.parentElement) {
      const styles = getComputedStyle(node), bounds = node.getBoundingClientRect();
      const delta = (position: number, start: number, end: number) => position < start + 28 ? -step : position > end - 28 ? step : 0;
      const dx = /auto|scroll/.test(styles.overflowX) && node.scrollWidth > node.clientWidth ? delta(x, bounds.left, bounds.right) : 0;
      const dy = /auto|scroll/.test(styles.overflowY) && node.scrollHeight > node.clientHeight ? delta(y, bounds.top, bounds.bottom) : 0;
      if (!dx && !dy) continue;
      const left = node.scrollLeft, top = node.scrollTop; node.scrollBy({ left: dx, top: dy, behavior: "instant" });
      if (left !== node.scrollLeft || top !== node.scrollTop) { frame = requestAnimationFrame(draw); break; }
    }
  };
  const move = (next: PointerEvent) => {
    if (next.pointerId !== pointerId) return;
    x = next.clientX; y = next.clientY;
    if (!started && Math.hypot(x - startX, y - startY) < 6) return;
    if (!started) {
      // startDrag cancels a previous session, not this pending pointer owner.
      pending = noop; startDrag({ ...source, method: "pointer" }); pending = cleanup; started = true;
      preview = document.createElement("div"); preview.dataset.ui = "DragPreview"; preview.setAttribute("aria-hidden", "true");
      const appearance = getComputedStyle(source.element);
      Object.assign(preview.style, { color: appearance.color, backgroundColor: appearance.backgroundColor, borderColor: appearance.borderColor, font: appearance.font });
      preview.textContent = source.label; (source.element.closest("dialog[open]") ?? document.body).append(preview);
    }
    next.preventDefault(); if (!frame) frame = requestAnimationFrame(draw);
  };
  const up = (next: PointerEvent) => {
    if (next.pointerId !== pointerId) return;
    if (started) { x = next.clientX; y = next.clientY; hit(); dropDrag(); }
    cleanup();
  };
  const abort = () => { cleanup(); if (started) cancelDrag(); };
  const cleanup = () => {
    if (started) clickSuppression.set(handle, Date.now() + 300);
    if (frame) cancelAnimationFrame(frame); preview?.remove(); preview = null;
    window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", abort); window.removeEventListener("blur", abort);
    handle.removeEventListener("lostpointercapture", abort);
    if (handle.hasPointerCapture?.(pointerId)) handle.releasePointerCapture(pointerId);
    if (pending === cleanup) { pending = noop; pendingElement = null; }
  };
  pending = cleanup; pendingElement = source.element;
  window.addEventListener("pointermove", move, { passive: false }); window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", abort); window.addEventListener("blur", abort);
  handle.addEventListener("lostpointercapture", abort);
  try { handle.setPointerCapture(pointerId); } catch { /* Synthetic/unsupported capture keeps window listeners. */ }
}
