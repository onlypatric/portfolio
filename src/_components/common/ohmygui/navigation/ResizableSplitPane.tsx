import { Children, useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import "../theme.css";

export type ResizableSplitPaneProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: ReactNode;
  initialRatio?: number;
  ratio?: number;
  onRatioChange?: (ratio: number) => void;
  max?: number;
  min?: number;
  orientation?: "horizontal" | "vertical";
  /** Switch side-by-side panes to top/bottom below this container width; false opts out. */
  mobileBreakpoint?: number | false;
  resizable?: boolean;
  label?: string;
  classNames?: Partial<Record<"primary" | "secondary" | "handle", string>>;
};

export function ResizableSplitPane({
  children, className, classNames = {}, initialRatio = 0.5, ratio: controlledRatio, onRatioChange,
  max = 0.8, min = 0.2, orientation = "horizontal", mobileBreakpoint = 600,
  resizable = true, label = "Resize panes", style, ...props
}: ResizableSplitPaneProps) {
  const lower = Math.min(1, Math.max(0, Number.isFinite(min) ? min : 0.2));
  const upper = Math.max(lower, Math.min(1, Number.isFinite(max) ? max : 0.8));
  const clamp = (value: number) => Math.min(upper, Math.max(lower, Number.isFinite(value) ? value : 0.5));
  const [internal, setInternal] = useState(initialRatio), [compact, setCompact] = useState(false), [dragging, setDragging] = useState(false);
  const ratio = clamp(controlledRatio ?? internal);
  const root = useRef<HTMLDivElement>(null), drag = useRef<{ start: number; ratio: number; length: number; reverse: boolean } | null>(null);
  const id = useId(), panes = Children.toArray(children);
  const vertical = orientation === "vertical" || compact;
  const update = (next: number) => { const value = clamp(next); if (controlledRatio === undefined) setInternal(value); onRatioChange?.(value); };
  useEffect(() => {
    const element = root.current;
    if (!element || mobileBreakpoint === false) { setCompact(false); return; }
    const measure = () => setCompact(element.getBoundingClientRect().width <= mobileBreakpoint);
    measure(); const observer = new ResizeObserver(measure); observer.observe(element);
    return () => observer.disconnect();
  }, [mobileBreakpoint]);
  useEffect(() => { drag.current = null; setDragging(false); }, [vertical, resizable]);
  return <div {...props} ref={root} data-ui="ResizableSplitPane" data-orientation={vertical ? "vertical" : "horizontal"}
    data-dragging={dragging || undefined} data-resizable={resizable}
    className={twMerge("ui-resizable-split", className)}
    style={{ "--split-primary": ratio + "fr", "--split-secondary": 1 - ratio + "fr", ...style } as CSSProperties}>
    <div id={id + "-primary"} data-slot="primary" className={classNames.primary}>{panes[0]}</div>
    <div data-slot="handle" role="separator" aria-label={label} aria-controls={id + "-primary"}
      aria-orientation={vertical ? "horizontal" : "vertical"} aria-valuemin={Math.round(lower * 100)} aria-valuemax={Math.round(upper * 100)}
      aria-valuenow={Math.round(ratio * 100)} aria-valuetext={Math.round(ratio * 100) + "%"} aria-disabled={!resizable || undefined}
      tabIndex={resizable ? 0 : -1} className={classNames.handle}
      onPointerDown={(event) => {
        if (!resizable || event.button !== 0) return;
        const bounds = root.current?.getBoundingClientRect(); if (!bounds) return;
        event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId);
        const handle = event.currentTarget.getBoundingClientRect();
        drag.current = { start: vertical ? event.clientY : event.clientX, ratio, length: Math.max(1, vertical ? bounds.height - handle.height : bounds.width - handle.width), reverse: !vertical && getComputedStyle(event.currentTarget).direction === "rtl" };
        setDragging(true);
      }}
      onPointerMove={(event) => {
        const state = drag.current; if (!state || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
        update(state.ratio + ((vertical ? event.clientY : event.clientX) - state.start) / state.length * (state.reverse ? -1 : 1));
      }}
      onPointerUp={(event) => { drag.current = null; setDragging(false); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
      onPointerCancel={() => { drag.current = null; setDragging(false); }}
      onLostPointerCapture={() => { drag.current = null; setDragging(false); }}
      onDoubleClick={() => { if (resizable) update(initialRatio); }}
      onKeyDown={(event) => {
        if (!resizable) return;
        const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
        const decrease = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
        const increase = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
        if (![decrease, increase, "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        update(event.key === "Home" ? lower : event.key === "End" ? upper : ratio + (event.key === increase ? 1 : -1) * (event.shiftKey ? .1 : .02));
      }}><span aria-hidden="true" /></div>
    <div id={id + "-secondary"} data-slot="secondary" className={classNames.secondary}>{panes[1]}</div>
  </div>;
}
