import "../theme.css";
import { useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import type { DragDelta } from "./_types";
export type DragGestureProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "onDrag"> & {
  axis?: "both" | "horizontal" | "vertical";
  bounds?: { bottom?: number; left?: number; right?: number; top?: number };
  children?: ReactNode; onDrag?: (delta: DragDelta) => void; snap?: number; keyboardStep?: number;
};
export function DragGesture({ axis = "both", bounds, children, className, keyboardStep = 8, onDrag, snap, style, ...props }: DragGestureProps) {
  const [offset, setOffset] = useState<DragDelta>({ x: 0, y: 0 }), [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 }), origin = useRef(offset);
  const normalize = (value: DragDelta) => {
    const x = axis === "vertical" ? 0 : snap && snap > 0 ? Math.round(value.x / snap) * snap : value.x;
    const y = axis === "horizontal" ? 0 : snap && snap > 0 ? Math.round(value.y / snap) * snap : value.y;
    return { x: Math.min(bounds?.right ?? Infinity, Math.max(bounds?.left ?? -Infinity, x)), y: Math.min(bounds?.bottom ?? Infinity, Math.max(bounds?.top ?? -Infinity, y)) };
  };
  const update = (next: DragDelta) => { const normalized = normalize(next); setOffset(normalized); onDrag?.(normalized); };
  return <div {...props} data-ui="DragGesture" data-dragging={dragging || undefined} tabIndex={props.tabIndex ?? 0}
    style={{ transform: "translate(" + offset.x + "px, " + offset.y + "px)", touchAction: axis === "horizontal" ? "pan-y" : axis === "vertical" ? "pan-x" : "none", ...style }}
    onPointerDown={(event) => { props.onPointerDown?.(event); if (event.defaultPrevented || event.button !== 0) return; start.current = { x: event.clientX, y: event.clientY }; origin.current = offset; event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); }}
    onPointerMove={(event) => { props.onPointerMove?.(event); if (!event.defaultPrevented && event.currentTarget.hasPointerCapture(event.pointerId)) update({ x: origin.current.x + event.clientX - start.current.x, y: origin.current.y + event.clientY - start.current.y }); }}
    onPointerUp={(event) => { props.onPointerUp?.(event); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); setDragging(false); }}
    onPointerCancel={(event) => { props.onPointerCancel?.(event); update(origin.current); setDragging(false); }}
    onKeyDown={(event) => { props.onKeyDown?.(event); if (event.defaultPrevented) return; const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key]; if (delta) { event.preventDefault(); const step = snap && snap > 0 ? snap : keyboardStep; update({ x: offset.x + delta[0] * step, y: offset.y + delta[1] * step }); } }}
    className={twMerge("cursor-grab rounded-[var(--field-radius)] active:cursor-grabbing", className)}>{children}</div>;
}
