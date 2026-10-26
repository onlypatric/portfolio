import { Button } from "../control/button/Button";
import "../theme.css";
import "../theme/design-system.css";
import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import { materialAttributes, type MaterialProps } from "../_material";
import { usePopupMotion, type PopupAnimationProps } from "../_usePopupMotion";

export type PopoverProps = UIProps & MaterialProps & PopupAnimationProps & Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  triggerAppearance?: "default" | "plain";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "end" | "start";
  title?: ReactNode;
  trigger: ReactNode;
  classNames?: Partial<Record<"trigger" | "panel" | "title", string>>;
};
export function Popover({ triggerAppearance = "default", children, className, classNames = {}, material = false, onOpenChange, open, openingAnimation, closingAnimation, placement = "start", title, trigger, ...props }: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const current = open ?? internalOpen;
  const id = useId(), root = useRef<HTMLDivElement>(null), button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const popup = usePopupMotion(current, { panelRef: panel, triggerRef: button, openingAnimation, closingAnimation });
  const change = (next: boolean) => { if (open === undefined) setInternalOpen(next); onOpenChange?.(next); };
  useEffect(() => {
    if (!current) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) change(false); };
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); change(false); button.current?.focus(); } };
    document.addEventListener("pointerdown", outside); root.current?.addEventListener("keydown", escape);
    const node = root.current;
    return () => { document.removeEventListener("pointerdown", outside); node?.removeEventListener("keydown", escape); };
  }, [current, onOpenChange, open]);
  return <div {...props} data-ui="Popover" ref={root} className={twMerge("relative inline-block", className)}>
    <Button variant="unstyled" type="button" data-slot="trigger" ref={button} aria-expanded={current} aria-controls={id} onClick={() => change(!current)} className={twMerge("rounded-[var(--field-radius)] bg-[var(--default)] px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-[length:var(--ui-font-size-sm)] font-medium", triggerAppearance === "plain" && "bg-transparent p-0", "ui-popover-trigger", classNames.trigger)}>{trigger}</Button>
    {popup.present && <div {...materialAttributes(material, { tint: "var(--overlay)" })} ref={panel} id={id} data-slot="panel" role="region" aria-label={typeof title === "string" ? title : "Additional information"} className={twMerge("ui-popover-panel absolute top-full mt-[var(--ui-space-2)] w-[var(--ui-popover-width)] p-[var(--ui-space-4)]", material !== false && "ui-material", placement === "end" ? "end-0" : "start-0", classNames.panel)}>{title && <h2 data-slot="title" className={twMerge("mb-[var(--ui-space-2)] font-semibold", classNames.title)}>{title}</h2>}{children}</div>}
  </div>;
}
