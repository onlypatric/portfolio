import type { UIProps } from "../_types";
import "../theme.css";
import { Children, Fragment, cloneElement, createContext, isValidElement, useContext, useId, useLayoutEffect, useRef, useSyncExternalStore, type DragEvent, type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../control/button/Button";
import { DRAG_MIME, cancelDrag, compatible, dragKeyboard, dragServerSnapshot, dragSnapshot, dropDrag, focusDragTarget, pointDragTarget, pointerDrag, pointerPending, registerDragContainer, releaseDragSource, setDragTarget, startDrag, subscribeDrag, suppressDragClick, validDragItemKey, type DragContainer, type DragItemKey, type ItemDrop } from "./_drag";

export type { DragItemKey, ItemDrop } from "./_drag";

export type DraggableProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "draggable"> & {
  children?: ReactNode;
  effectAllowed?: DataTransfer["effectAllowed"];
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
  payload: string;
};

function DraggableRoot({ children, className, effectAllowed = "copy", onDragStart, payload, ...props }: DraggableProps) {
  return <div data-ui="Draggable" {...props} draggable onDragStart={(event) => { event.dataTransfer.effectAllowed = effectAllowed; event.dataTransfer.setData("text/plain", payload); onDragStart?.(event); }} className={twMerge("cursor-grab focus-visible:outline-2 focus-visible:outline-[var(--focus)]", className)}>{children}</div>;
}

const ContainerContext = createContext<{ id: string; dragKey: string; disabled: boolean } | null>(null);
const EmptyContext = createContext(false);
export type DraggableEmptyProps = UIProps & ComponentPropsWithoutRef<"div">;
function DraggableEmpty(props: DraggableEmptyProps) {
  if (!useContext(EmptyContext)) throw new Error("Draggable.Empty must be a direct child of Draggable.Container.");
  return <div {...props} data-slot="empty" className={twMerge("ui-drag-empty", props.className)} />;
}
export type DraggableItemProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "draggable"> & {
  itemKey: DragItemKey;
  dragKey?: string;
  label: string;
  payload?: unknown;
  disabled?: boolean;
  /** Opt into native body dragging; handles preserve text selection by default. */
  nativeDrag?: boolean;
  handleLabel?: string;
  classNames?: Partial<Record<"handle" | "body", string>>;
};
function DraggableItem({ itemKey, dragKey, label, payload, disabled = false, nativeDrag = false, handleLabel, children, className, classNames = {}, onDragStart, onDragEnd, onPointerDownCapture, ...props }: DraggableItemProps) {
  const parent = useContext(ContainerContext), element = useRef<HTMLDivElement>(null), instructions = useId();
  const interactiveStart = useRef(false);
  const state = useSyncExternalStore(subscribeDrag, dragSnapshot, dragServerSnapshot);
  const group = dragKey ?? parent?.dragKey;
  if (!validDragItemKey(itemKey)) throw new Error("Draggable.Item itemKey must be a string or finite number.");
  if (!label.trim()) throw new Error("Draggable.Item needs a nonempty accessible label.");
  if (!group?.trim()) throw new Error("Draggable.Item needs a dragKey or a Draggable.Container parent.");
  const unavailable = disabled || parent?.disabled;
  const source = () => ({ itemKey, dragKey: group, label, payload, sourceId: parent?.id, element: element.current! });
  const dragging = state.source?.element === element.current;
  useLayoutEffect(() => {
    const node = element.current;
    return () => releaseDragSource(node);
  }, [itemKey, group]);
  useLayoutEffect(() => { if (unavailable) releaseDragSource(element.current); }, [unavailable, dragging]);
  return <div {...props} ref={element} data-ui="DraggableItem" data-ui-drag-item="" data-item-key={itemKey}
    data-drag-key-type={typeof itemKey} data-dragging={dragging || undefined} aria-disabled={unavailable || undefined}
    draggable={nativeDrag && !unavailable} className={twMerge("ui-drag-item", className)}
    onPointerDownCapture={event => { onPointerDownCapture?.(event); interactiveStart.current = !!(event.target as HTMLElement).closest('button,a[href],input,textarea,select,[contenteditable="true"]'); }}
    onDragStart={event => {
      if ((event.target as HTMLElement).closest("[data-ui-drag-item]") !== element.current) return;
      onDragStart?.(event);
      if (event.defaultPrevented || !nativeDrag || unavailable || pointerPending() || interactiveStart.current) { event.preventDefault(); return; }
      event.stopPropagation(); event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(DRAG_MIME, "1");
      startDrag({ ...source(), method: "native" });
    }} onDragEnd={event => { onDragEnd?.(event); if (dragSnapshot().source?.element === element.current) cancelDrag(); }}>
    <Button variant="unstyled" type="button" data-slot="dragHandle" draggable={false} disabled={unavailable}
      aria-label={handleLabel ?? `Move ${label}`} aria-describedby={instructions} aria-pressed={dragging}
      className={twMerge("ui-drag-handle", classNames.handle)}
      onPointerDown={event => { if (!unavailable) pointerDrag(event.nativeEvent, source(), event.currentTarget); }}
      onClick={event => {
        if (unavailable || suppressDragClick(event.currentTarget)) return;
        const current = dragSnapshot();
        if (current.source) { if (current.target) dropDrag(); else cancelDrag(); }
        else startDrag({ ...source(), method: "keyboard" });
      }}
      onFocus={() => { if (element.current) focusDragTarget(element.current); }}
      onKeyDown={event => { if (dragSnapshot().source) dragKeyboard(event); }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><circle cx="6" cy="4" r="1" /><circle cx="12" cy="4" r="1" /><circle cx="6" cy="9" r="1" /><circle cx="12" cy="9" r="1" /><circle cx="6" cy="14" r="1" /><circle cx="12" cy="14" r="1" /></svg>
    </Button>
    <div data-slot="body" className={twMerge("ui-drag-body", classNames.body)}>{children}</div>
    <span id={instructions} className="sr-only">Press Enter or Space to pick up. Use arrows, Home or End to choose a position. Enter places; Escape cancels. Tab reaches other destinations.</span>
  </div>;
}
export type DraggableContainerProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "onDrop"> & {
  dragKey: string;
  accept?: readonly string[];
  disabled?: boolean;
  orientation?: DragContainer["orientation"];
  onDrop?: (drop: ItemDrop) => void;
  dropLabel?: string;
};
function DraggableContainer({ dragKey, accept, disabled = false, orientation = "vertical", onDrop, dropLabel = "Place item here", children, className, onDragEnter, onDragOver, onDragLeave, ...props }: DraggableContainerProps) {
  const generated = useId(), id = props.id ?? generated, root = useRef<HTMLDivElement>(null);
  const registry = useRef<DragContainer | null>(null);
  const state = useSyncExternalStore(subscribeDrag, dragSnapshot, dragServerSnapshot);
  if (!dragKey.trim()) throw new Error("Draggable.Container requires a nonempty dragKey.");
  const accepts = accept ?? [dragKey];
  const items: ReactElement<DraggableItemProps>[] = []; let empty: ReactElement | null = null;
  const keys = new Set<DragItemKey>();
  const collect = (nodes: ReactNode) => Children.forEach(nodes, child => {
    if (child == null || typeof child === "boolean") return;
    if (!isValidElement<{ children?: ReactNode }>(child)) throw new Error("Draggable.Container expects Draggable.Item and Draggable.Empty children.");
    if (child.type === Fragment) { collect(child.props.children); return; }
    if (child.type === DraggableEmpty) { if (empty) throw new Error("Only one Draggable.Empty is allowed."); empty = child; return; }
    if (child.type !== DraggableItem) throw new Error("Draggable.Container expects Draggable.Item and Draggable.Empty children.");
    const item = child as ReactElement<DraggableItemProps>;
    if (keys.has(item.props.itemKey)) throw new Error("Draggable.Item itemKey must be unique within its container.");
    keys.add(item.props.itemKey); items.push(item);
  });
  collect(children);
  const descriptor = { id, element: root.current!, accepts, disabled, orientation, onDrop: onDrop ?? (() => {}) };
  if (registry.current) Object.assign(registry.current, descriptor);
  useLayoutEffect(() => {
    registry.current = { ...descriptor, element: root.current! };
    return registerDragContainer(registry.current);
  }, [id]);
  const accepted = compatible({ accepts, disabled }, state.source), targeted = accepted && state.target?.containerId === id;
  const over = (event: DragEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || (event.target as HTMLElement).closest("[data-ui-drag-container]") !== root.current || !registry.current || !compatible(registry.current) || state.source?.method !== "native") return;
    event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = "move";
    pointDragTarget(registry.current, event.clientX, event.clientY);
  };
  return <ContainerContext value={{ id, dragKey, disabled }}>
    <div {...props} ref={root} id={id} data-ui="DraggableContainer" data-ui-drag-container="" data-drag-accept={accepts.join("\n")}
      aria-label={props["aria-label"] ?? "Drop area"} aria-disabled={disabled || undefined} role={props.role ?? "group"} tabIndex={props.tabIndex ?? -1}
      data-orientation={orientation} data-compatible={accepted || undefined} data-targeted={targeted || undefined}
      data-drop-index={targeted ? state.target?.index : undefined}
      className={twMerge("ui-drag-container", className)}
      onDragEnter={event => { onDragEnter?.(event); over(event); }} onDragOver={event => { onDragOver?.(event); over(event); }}
      onDragLeave={event => { onDragLeave?.(event); if (!event.currentTarget.contains(event.relatedTarget as Node) && targeted) setDragTarget(null); }}
      onDrop={event => {
        if ((event.target as HTMLElement).closest("[data-ui-drag-container]") !== root.current) return;
        if (registry.current && compatible(registry.current) && dragSnapshot().source?.method === "native") { over(event); event.preventDefault(); event.stopPropagation(); dropDrag(); }
      }}>
      {items.map((item, index) => <Fragment key={`${typeof item.props.itemKey}:${item.props.itemKey}`}>
        {cloneElement(item, { key: "item", className: twMerge(item.props.className,
          targeted && state.target?.index === index && "ui-drag-before",
          targeted && state.target?.index === items.length && index === items.length - 1 && "ui-drag-after") })}
      </Fragment>)}
      {!items.length && <EmptyContext value={true}>{empty}</EmptyContext>}
      {accepted && state.source?.method === "keyboard" && <Button type="button" variant="outline" data-slot="dropAction" onClick={() => { setDragTarget({ containerId: id, index: items.length }); dropDrag(); }}
        onFocus={() => setDragTarget({ containerId: id, index: items.length })} onKeyDown={dragKeyboard}>{dropLabel}</Button>}
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">{state.announcementId === id ? state.message : ""}</span>
    </div>
  </ContainerContext>;
}

export const Draggable = Object.assign(DraggableRoot, { Container: DraggableContainer, Empty: DraggableEmpty, Item: DraggableItem });
