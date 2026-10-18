import "../theme.css";
import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import { materialAttributes, type MaterialProps } from "../_material";
import { usePopupMotion, type PopupAnimationProps } from "../_usePopupMotion";

export type TooltipProps = UIProps & MaterialProps & PopupAnimationProps & {
  children: ReactNode;
  content: ReactNode;
  delay?: number;
  placement?: "bottom" | "top";
  classNames?: Partial<Record<"content", string>>;
};
export function Tooltip({ children, className, classNames, content, delay = 250, material = false, placement = "top", style, openingAnimation, closingAnimation }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const owner = useRef<HTMLSpanElement>(null), panel = useRef<HTMLSpanElement>(null);
  const popup = usePopupMotion(open, { panelRef: panel, triggerRef: owner, openingAnimation, closingAnimation });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const close = () => { clearTimeout(timer.current); setOpen(false); };
  const show = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), delay); };
  useEffect(() => () => clearTimeout(timer.current), []);
  const trigger = isValidElement<HTMLAttributes<HTMLElement>>(children)
    ? cloneElement(children, { "aria-describedby": [children.props["aria-describedby"], open ? id : undefined].filter(Boolean).join(" ") || undefined })
    : <span tabIndex={0} aria-describedby={open ? id : undefined}>{children}</span>;
  return <span ref={owner} data-ui="Tooltip" className={twMerge("relative inline-flex", className)} style={style} onMouseEnter={show} onMouseLeave={close} onFocus={show} onBlur={close} onKeyDown={(event) => { if (open && event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); } }}>
    {trigger}{popup.present && <span ref={panel} {...materialAttributes(material, { tint: "var(--foreground)", opacity: .94 })} id={id} role="tooltip" data-slot="content" data-placement={placement} className={twMerge("ui-tooltip-bubble", material !== false && "ui-material", classNames?.content)}>{content}</span>}
  </span>;
}
