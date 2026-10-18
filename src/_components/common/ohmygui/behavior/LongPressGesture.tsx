import "../theme.css";
import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
export type LongPressGestureProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode; duration?: number; onLongPress?: () => void; threshold?: number;
};
export function LongPressGesture({ children, className, duration = 500, onLongPress, threshold = 8, ...props }: LongPressGestureProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined), start = useRef({ x: 0, y: 0 });
  const [pressing, setPressing] = useState(false);
  const cancel = () => { clearTimeout(timer.current); timer.current = undefined; setPressing(false); };
  useEffect(() => () => clearTimeout(timer.current), []);
  return <div {...props} data-ui="LongPressGesture" data-pressing={pressing || undefined} role={props.role ?? "button"} tabIndex={props.tabIndex ?? 0}
    onPointerDown={(event) => { props.onPointerDown?.(event); if (event.defaultPrevented || event.button !== 0) return; start.current = { x: event.clientX, y: event.clientY }; setPressing(true); timer.current = setTimeout(() => { setPressing(false); onLongPress?.(); }, duration); event.currentTarget.setPointerCapture(event.pointerId); }}
    onPointerMove={(event) => { props.onPointerMove?.(event); if (Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) > threshold) cancel(); }}
    onPointerUp={(event) => { props.onPointerUp?.(event); cancel(); }} onPointerCancel={(event) => { props.onPointerCancel?.(event); cancel(); }}
    onKeyDown={(event) => { props.onKeyDown?.(event); if (!event.defaultPrevented && !event.repeat && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onLongPress?.(); } }}
    className={twMerge("select-none rounded-[var(--field-radius)]", className)}>{children}</div>;
}
