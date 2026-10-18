import { Button } from "../control/button/Button";
import type { UIProps } from "../_types";
import "../theme.css";
import { useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { materialAttributes, type MaterialProps } from "../_material";
import { usePopupMotion, type PopupAnimationProps } from "../_usePopupMotion";

export type BannerProps = UIProps & MaterialProps & PopupAnimationProps & Omit<ComponentPropsWithoutRef<"aside">, "children"> & {
  children?: ReactNode;
  dismissable?: boolean;
  onDismiss?: () => void;
  title?: ReactNode;
  variant?: "danger" | "info" | "success" | "warning";
};

export function Banner({ children, className, dismissable = false, material = false, onDismiss, style, title, variant = "info", openingAnimation, closingAnimation, ...props }: BannerProps) {
  const appearance = materialAttributes(material, { tint: "var(--surface-secondary)", opacity: .94 });
  const [visible, setVisible] = useState(true);
  const panel = useRef<HTMLElement>(null), dismissed = useRef(false);
  const popup = usePopupMotion(visible, { panelRef: panel, openingAnimation, closingAnimation, onAfterClose: onDismiss, inert: props.inert, ariaHidden: props["aria-hidden"] });
  if (!popup.present) return null;
  const dismiss = () => { if (!dismissed.current) { dismissed.current = true; setVisible(false); } };
  return (
    <aside ref={panel} data-ui="Banner" {...props} {...appearance} inert={!visible || props.inert || undefined} aria-hidden={!visible || props["aria-hidden"] || undefined} style={{ ...appearance.style, ...style }} role={variant === "danger" || variant === "warning" ? "alert" : "status"} data-variant={variant} className={twMerge("flex items-start justify-between gap-[var(--ui-space-4)] rounded-[var(--radius)] border border-[var(--border)] px-[var(--ui-space-4)] py-[var(--ui-space-3)]", material !== false ? "ui-material" : "bg-[var(--surface-secondary)]", className)}>
      <div className="grid gap-[var(--ui-space-1)] text-[length:var(--ui-font-size-sm)]">{title && <strong>{title}</strong>}<div>{children}</div></div>
      {dismissable && <Button variant="unstyled" type="button" aria-label="Dismiss" onClick={dismiss} className="rounded p-[var(--ui-space-1)] text-[length:var(--ui-font-size-lg)] leading-none hover:bg-[var(--surface-tertiary)]">×</Button>}
    </aside>
  );
}
