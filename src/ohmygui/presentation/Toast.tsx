import { Button } from "../control/button/Button";
import "../theme.css";
import "../theme/design-system.css";
import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import { materialAttributes, type MaterialProps } from "../_material";
import { usePopupMotion, type PopupAnimationProps } from "../_usePopupMotion";

export type ToastProps = UIProps & MaterialProps & PopupAnimationProps & Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  placement?: "inline" | "bottom-end" | "bottom-center" | "top-end";
  actionLabel?: ReactNode; message: ReactNode; onAction?: () => void; onDismiss?: () => void;
  duration?: number; type?: "danger" | "info" | "success" | "warning";
  classNames?: Partial<Record<"message" | "action" | "close", string>>;
};
export function Toast({ placement = "inline", actionLabel, className, classNames = {}, duration = 4000, material = false, message, onAction, onDismiss, style, type = "info", openingAnimation, closingAnimation, ...props }: ToastProps) {
  const appearance = materialAttributes(material, { tint: "var(--overlay)", opacity: .94 });
  const [visible, setVisible] = useState(true), [paused, setPaused] = useState(false);
  const callback = useRef(onDismiss); callback.current = onDismiss;
  const panel = useRef<HTMLDivElement>(null), dismissed = useRef(false);
  const popup = usePopupMotion(visible, { panelRef: panel, openingAnimation, closingAnimation, onAfterClose: () => callback.current?.(), inert: props.inert, ariaHidden: props["aria-hidden"] });
  const dismiss = () => { if (!dismissed.current) { dismissed.current = true; setVisible(false); } };
  useEffect(() => {
    if (!visible || duration <= 0 || paused) return;
    const timer = window.setTimeout(dismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, paused, visible]);
  if (!popup.present) return null;
  return <div ref={panel} {...props} {...appearance} inert={!visible || props.inert || undefined} aria-hidden={!visible || props["aria-hidden"] || undefined} style={{ ...appearance.style, ...style }} data-ui="Toast" data-placement={placement} role={props.role ?? "status"} aria-live={props["aria-live"] ?? "polite"} data-type={type}
    onMouseEnter={(event) => { props.onMouseEnter?.(event); setPaused(true); }} onMouseLeave={(event) => { props.onMouseLeave?.(event); setPaused(false); }}
    onFocus={(event) => { props.onFocus?.(event); setPaused(true); }} onBlur={(event) => { props.onBlur?.(event); if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false); }}
    className={twMerge(placement !== "inline" && "ui-toast-positioned", "flex max-w-full items-center gap-[var(--ui-space-3)] rounded-[var(--radius)] border border-[var(--border)] px-[var(--ui-space-4)] py-[var(--ui-space-3)] text-[length:var(--ui-font-size-sm)] text-[var(--overlay-foreground)] shadow-[var(--ui-shadow-lg)]", material !== false ? "ui-material" : "bg-[var(--overlay)]", className)}>
    <span data-slot="message" className={twMerge("min-w-0 flex-1", classNames.message)}>{message}</span>
    {actionLabel && <Button variant="unstyled" data-slot="action" type="button" onClick={onAction} className={twMerge("font-semibold underline", classNames.action)}>{actionLabel}</Button>}
    <Button variant="unstyled" data-slot="close" type="button" aria-label="Dismiss" onClick={dismiss} className={twMerge("shrink-0 text-[length:var(--ui-font-size-lg)]", classNames.close)}>×</Button>
  </div>;
}
