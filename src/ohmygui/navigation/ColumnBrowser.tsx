import { Children, Fragment, isValidElement, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../control/button/Button";
import type { UIProps } from "../_types";
import "../theme.css";

export type ColumnBrowserItemProps = {
  id: string;
  label?: ReactNode;
  textValue?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  /** Interactive content rendered beside the navigation button, never inside it. */
  controls?: ReactNode;
  disabled?: boolean;
  /** Marks a parent with no children yet, displaying the empty state on selection. */
  branch?: boolean;
  children?: ReactNode;
};
export type ColumnBrowserProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "children" | "defaultValue"> & {
  children?: ReactNode;
  path?: readonly string[];
  defaultPath?: readonly string[];
  onPathChange?: (path: string[]) => void;
  defaultColumnWidth?: number;
  minColumnWidth?: number;
  maxColumnWidth?: number;
  resizable?: boolean;
  rootLabel?: string;
  backLabel?: string;
  resizeLabel?: string;
  detailLabel?: string;
  emptyState?: ReactNode;
};

function Label({ children }: { children?: ReactNode }) { return <>{children}</>; }
function Detail({ children }: { children?: ReactNode }) { return <>{children}</>; }
function ItemRoot(_props: ColumnBrowserItemProps) { return null; }
const Item = Object.assign(ItemRoot, { Label, Detail });
type Node = ColumnBrowserItemProps & { name: string; items: Node[]; detail: ReactNode; hasDetail: boolean; isBranch: boolean };
function text(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (isValidElement<{ children?: ReactNode }>(node)) return text(node.props.children);
  if (Array.isArray(node)) return node.map(text).join(" ");
  return "";
}
function parse(children: ReactNode): Node[] {
  const items: Node[] = [], ids = new Set<string>();
  const visit = (value: ReactNode) => Children.forEach(value, child => {
    if (child == null || typeof child === "boolean") return;
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) { visit(child.props.children); return; }
    if (!isValidElement<ColumnBrowserItemProps>(child) || child.type !== Item) throw new Error("ColumnBrowser accepts only ColumnBrowser.Item children (and fragments).");
    const props = child.props;
    if (typeof props.id !== "string" || !props.id.trim() || ids.has(props.id)) throw new Error("ColumnBrowser.Item requires a nonempty id unique among siblings.");
    ids.add(props.id);
    let label = props.label, detail: ReactNode, hasLabel = false, hasDetail = false;
    const nested: ReactNode[] = [];
    const slots = (value: ReactNode) => Children.forEach(value, slot => {
      if (isValidElement<{ children?: ReactNode }>(slot) && slot.type === Fragment) { slots(slot.props.children); return; }
      if (isValidElement<{ children?: ReactNode }>(slot) && slot.type === Label) {
        if (hasLabel || props.label !== undefined) throw new Error("Use either label or one ColumnBrowser.Item.Label.");
        hasLabel = true; label = slot.props.children;
      } else if (isValidElement<{ children?: ReactNode }>(slot) && slot.type === Detail) {
        if (hasDetail) throw new Error("Only one ColumnBrowser.Item.Detail is allowed per item.");
        hasDetail = true; detail = slot.props.children;
      } else nested.push(slot);
    });
    slots(props.children);
    const descendants = parse(nested), name = props.textValue?.trim() || text(label).trim();
    if (!name) throw new Error("ColumnBrowser.Item needs a readable label or textValue for keyboard search and accessibility.");
    items.push({ ...props, label: label ?? name, name, items: descendants, detail, hasDetail, isBranch: !!props.branch || descendants.length > 0 });
  });
  visit(children);
  return items;
}

function ColumnBrowserRoot({ children, path, defaultPath = [], onPathChange, defaultColumnWidth = 260, minColumnWidth = 180, maxColumnWidth = 600, resizable = true, rootLabel = "Browse", backLabel = "Back", resizeLabel = "Resize column", detailLabel = "Details", emptyState = "No items", className, style, ...props }: ColumnBrowserProps) {
  const nodes = useMemo(() => parse(children), [children]), [localPath, setLocalPath] = useState<readonly string[]>(defaultPath);
  const root = useRef<HTMLDivElement>(null), pendingFocus = useRef<{ depth: number; id?: string } | null>(null);
  const id = useId(), [widths, setWidths] = useState<Record<string, number>>({});
  const search = useRef({ value: "", time: 0 });
  const minimum = Number.isFinite(minColumnWidth) ? Math.max(120, minColumnWidth) : 180;
  const maximum = Number.isFinite(maxColumnWidth) ? Math.max(minimum, maxColumnWidth) : 600;
  const clamp = (value: number) => Math.max(minimum, Math.min(maximum, value));
  const baseWidth = clamp(Number.isFinite(defaultColumnWidth) ? defaultColumnWidth : 260);
  const selected: Node[] = [], validPath: string[] = [];
  const columns: { key: string; label: string; items: Node[]; prefix: string[] }[] = [{ key: "[]", label: rootLabel, items: nodes, prefix: [] }];
  let current = nodes;
  for (const key of path ?? localPath) {
    const node = current.find(item => item.id === key && !item.disabled);
    if (!node) break;
    selected.push(node); validPath.push(key);
    if (!node.isBranch) break;
    columns.push({ key: JSON.stringify(validPath), label: node.name, items: node.items, prefix: [...validPath] });
    current = node.items;
  }
  const leaf = selected.at(-1), showDetail = !!leaf && !leaf.isBranch && leaf.hasDetail;
  const signature = JSON.stringify(validPath);
  const change = (next: string[]) => { if (path === undefined) setLocalPath(next); onPathChange?.(next); };
  const focusItem = (depth: number, itemId?: string) => {
    const column = root.current?.querySelector<HTMLElement>(`[data-column-depth="${depth}"]`);
    const options = Array.from(column?.querySelectorAll<HTMLButtonElement>('[data-browser-option]:not(:disabled)') ?? []);
    (options.find(option => option.dataset.itemId === itemId) ?? options[0] ?? column)?.focus({ preventScroll: true });
  };
  useLayoutEffect(() => {
    if (pendingFocus.current) {
      focusItem(pendingFocus.current.depth, pendingFocus.current.id);
      pendingFocus.current = null;
    }
    const viewport = root.current?.querySelector<HTMLElement>('[data-slot="columns"]');
    const last = viewport?.lastElementChild as HTMLElement | null;
    if (viewport && last) {
      const bounds = viewport.getBoundingClientRect(), target = last.getBoundingClientRect();
      // Scroll only the browser's horizontal viewport, never the document or an ancestor.
      if (target.right > bounds.right) viewport.scrollLeft += target.right - bounds.right;
      if (target.left < bounds.left) viewport.scrollLeft -= bounds.left - target.left;
    }
  }, [signature, showDetail]);
  useEffect(() => { search.current = { value: "", time: 0 }; }, [signature]);
  useEffect(() => {
    const owner = root.current;
    if (!owner || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      const active = document.activeElement as HTMLElement | null;
      if (active && owner.contains(active) && !active.getClientRects().length) {
        const last = owner.querySelector<HTMLElement>('[data-slot="columns"]')?.lastElementChild;
        const target = last?.querySelector<HTMLElement>('[data-browser-option][data-selected="true"], [data-browser-option]:not(:disabled), [data-column-depth]') ?? last as HTMLElement | null;
        target?.focus({ preventScroll: true });
      }
    });
    observer.observe(owner);
    return () => observer.disconnect();
  }, []);
  const keydown = (event: KeyboardEvent<HTMLButtonElement>, depth: number, node: Node, index: number) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.nativeEvent.isComposing) return;
    const column = columns[depth], enabled = column.items.filter(item => !item.disabled);
    const position = enabled.indexOf(node), rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight", backward = rtl ? "ArrowRight" : "ArrowLeft";
    if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : Math.max(0, Math.min(enabled.length - 1, position + (event.key === "ArrowDown" ? 1 : -1)));
      focusItem(depth, enabled[next]?.id);
    } else if (event.key === forward && (node.isBranch || node.hasDetail)) {
      event.preventDefault();
      if (selected[depth]?.id === node.id && (columns[depth + 1] || showDetail)) {
        focusItem(depth + 1, selected[depth + 1]?.id);
        return;
      }
      pendingFocus.current = { depth: depth + 1 };
      const next = [...column.prefix, node.id];
      if (JSON.stringify(next) === signature) { focusItem(depth + 1); pendingFocus.current = null; }
      else change(next);
    } else if (event.key === backward && depth > 0) {
      event.preventDefault(); pendingFocus.current = { depth: depth - 1, id: column.prefix.at(-1) };
      change(column.prefix.slice(0, -1));
    } else if (event.key.length === 1 && event.key !== " ") {
      const now = performance.now();
      search.current.value = (now - search.current.time < 600 ? search.current.value : "") + event.key.toLocaleLowerCase();
      search.current.time = now;
      const query = search.current.value, repeating = [...query].every(char => char === query[0]);
      const ordered = [...column.items.slice(index + 1), ...column.items.slice(0, index + 1)];
      const match = ordered.find(item => !item.disabled && item.name.toLocaleLowerCase().startsWith(repeating ? query[0] : query));
      if (match) { event.preventDefault(); focusItem(depth, match.id); }
    }
  };
  const resize = useRef<{ pointer: number; start: number; width: number; key: string; rtl: boolean; original: number | undefined } | null>(null);
  const back = () => {
    const next = validPath.slice(0, -1);
    pendingFocus.current = { depth: Math.max(0, columns.length - (showDetail ? 1 : 2)), id: validPath.at(-1) };
    change(next);
  };
  return <div {...props} role={props.role ?? "group"} aria-label={props["aria-label"] ?? (props["aria-labelledby"] ? undefined : rootLabel)} ref={root} data-ui="ColumnBrowser" className={twMerge("ui-column-browser", className)} style={style}>
    <div data-slot="navigation"><Button variant="ghost" size="sm" disabled={!validPath.length} onClick={back}>‹ {backLabel}</Button><span>{selected.map(node => node.name).join(" / ") || rootLabel}</span></div>
    <div data-slot="columns">
      {columns.map((column, depth) => {
        const width = clamp(widths[column.key] ?? baseWidth), chosen = selected[depth];
        const first = column.items.find(item => !item.disabled);
        const hasControls = column.items.some(item => item.controls != null);
        return <section key={column.key} className="ui-browser-column" style={{ inlineSize: width }} aria-labelledby={`${id}-${depth}-heading`}>
          <h3 id={`${id}-${depth}-heading`}>{column.label}</h3>
          <div role={hasControls ? "list" : "listbox"} aria-labelledby={`${id}-${depth}-heading`} aria-orientation={hasControls ? undefined : "vertical"} tabIndex={column.items.some(item => !item.disabled) ? -1 : 0} data-column-depth={depth}>
            {column.items.length ? column.items.map((node, index) => {
              const navigation = <Button key={node.id} variant="unstyled" role={hasControls ? undefined : "option"} aria-selected={hasControls ? undefined : chosen?.id === node.id} aria-current={hasControls && chosen?.id === node.id ? "true" : undefined} data-browser-option="" data-selected={chosen?.id === node.id} aria-label={node.name} disabled={node.disabled} tabIndex={chosen?.id === node.id || (!chosen && first === node) ? 0 : -1}
              data-item-id={node.id} data-branch={node.isBranch || undefined} className="ui-browser-item" onClick={() => {
                const next = [...column.prefix, node.id];
                if (root.current && root.current.clientWidth <= 600 && (node.isBranch || node.hasDetail)) {
                  if (JSON.stringify(next) === signature) focusItem(depth + 1);
                  else pendingFocus.current = { depth: depth + 1 };
                }
                change(next);
              }}
              onFocus={event => {
                const parent = event.currentTarget.closest<HTMLElement>('[data-column-depth]')!, row = event.currentTarget;
                parent.querySelectorAll<HTMLElement>('[data-browser-option]').forEach(item => { item.tabIndex = item === row ? 0 : -1; });
                const bounds = parent.getBoundingClientRect(), target = row.getBoundingClientRect();
                if (target.top < bounds.top) parent.scrollTop -= bounds.top - target.top;
                else if (target.bottom > bounds.bottom) parent.scrollTop += target.bottom - bounds.bottom;
                const viewport = root.current?.querySelector<HTMLElement>('[data-slot="columns"]');
                const section = parent.parentElement;
                if (viewport && section) {
                  const outer = viewport.getBoundingClientRect(), inner = section.getBoundingClientRect();
                  if (inner.left < outer.left) viewport.scrollLeft -= outer.left - inner.left;
                  else if (inner.right > outer.right) viewport.scrollLeft += inner.right - outer.right;
                }
              }}
              onKeyDown={event => keydown(event, depth, node, index)}>
              {node.startContent != null && <span data-slot="startContent" aria-hidden="true">{node.startContent}</span>}
              <span data-slot="label">{node.label}</span>
              {node.endContent != null && <span data-slot="endContent" aria-hidden="true">{node.endContent}</span>}
              {node.isBranch && <span data-slot="chevron" aria-hidden="true">›</span>}
            </Button>;
              return hasControls ? <div key={node.id} role="listitem" className="ui-browser-resource" data-selected={chosen?.id === node.id}>
                {navigation}
                {node.controls != null && <div data-slot="controls" role="group" aria-label={`${node.name} controls`} inert={node.disabled || undefined}>{node.controls}</div>}
              </div> : navigation;
            }) : <div data-slot="empty">{emptyState}</div>}
          </div>
          {resizable && <div role="separator" tabIndex={0} aria-label={`${resizeLabel}: ${column.label}`} aria-orientation="vertical" aria-valuemin={minimum} aria-valuemax={maximum} aria-valuenow={width} className="ui-browser-resize"
            onDoubleClick={() => setWidths(values => ({ ...values, [column.key]: baseWidth }))}
            onKeyDown={event => {
              const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault(); const step = event.shiftKey ? 40 : 10;
              const value = event.key === "Home" ? minimum : event.key === "End" ? maximum : width + (event.key === (rtl ? "ArrowLeft" : "ArrowRight") ? step : -step);
              setWidths(values => ({ ...values, [column.key]: clamp(value) }));
            }}
            onPointerDown={event => {
              if (event.button !== 0 || !event.isPrimary) return;
              event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId);
              resize.current = { pointer: event.pointerId, start: event.clientX, width, key: column.key, rtl: getComputedStyle(event.currentTarget).direction === "rtl", original: widths[column.key] };
            }}
            onPointerMove={event => { const drag = resize.current; if (drag?.pointer === event.pointerId) setWidths(values => ({ ...values, [drag.key]: clamp(drag.width + (event.clientX - drag.start) * (drag.rtl ? -1 : 1)) })); }}
            onPointerUp={() => { resize.current = null; }}
            onPointerCancel={() => { const drag = resize.current; if (drag) setWidths(values => { const next = { ...values }; if (drag.original === undefined) delete next[drag.key]; else next[drag.key] = drag.original; return next; }); resize.current = null; }}
            onLostPointerCapture={() => { resize.current = null; }} />}
        </section>;
      })}
      {showDetail && <section key={`detail-${signature}`} className="ui-browser-detail" aria-label={`${leaf.name}: ${detailLabel}`} tabIndex={0} data-column-depth={columns.length}
        onKeyDown={event => {
          if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
          const backward = getComputedStyle(event.currentTarget).direction === "rtl" ? "ArrowRight" : "ArrowLeft";
          if (event.key === backward) { event.preventDefault(); back(); }
        }}>{leaf.detail}</section>}
    </div>
  </div>;
}

export const ColumnBrowser = Object.assign(ColumnBrowserRoot, { Item });
