import { Button } from "../control/button/Button";
import "../theme.css";
import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import { materialAttributes, type MaterialProps } from "../_material";
import { MenuItem } from "./MenuItem";
import type { PresentationMenuItem } from "./_types";
import { usePopupMotion, type PopupAnimationProps } from "../_usePopupMotion";

export type MenuProps = UIProps & MaterialProps & PopupAnimationProps & Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  items: PresentationMenuItem[];
  placement?: "end" | "start";
  trigger: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  classNames?: Partial<Record<"trigger" | "panel" | "item", string>>;
};

export function Menu({ className, classNames = {}, items, material = false, onOpenChange, open, openingAnimation, closingAnimation, placement = "start", trigger, ...props }: MenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const current = open ?? internalOpen;
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const popup = usePopupMotion(current, { panelRef, triggerRef, openingAnimation, closingAnimation });
  const change = (next: boolean) => { if (open === undefined) setInternalOpen(next); onOpenChange?.(next); };
  const options = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled):not([aria-disabled="true"])') ?? []);
  useEffect(() => {
    if (!current) return;
    options()[0]?.focus();
    const outside = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) change(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [current, open, onOpenChange]);
  const keydown = (event: KeyboardEvent<HTMLDivElement>) => {
    props.onKeyDown?.(event);
    if (event.defaultPrevented || !current) return;
    const entries = options(), index = entries.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") { event.preventDefault(); change(false); triggerRef.current?.focus(); }
    else if (event.key === "Tab") change(false);
    else if (entries.length && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? entries.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + entries.length) % entries.length;
      entries[next].focus();
    }
  };
  return <div {...props} ref={rootRef} data-ui="Menu" className={twMerge("relative inline-block", className)} onKeyDown={keydown}>
    <Button variant="unstyled" ref={triggerRef} type="button" data-slot="trigger" aria-haspopup="menu" aria-expanded={current} aria-controls={id} onClick={() => change(!current)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); change(true); } }} className={twMerge("rounded-[var(--field-radius)] bg-[var(--default)] px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-[length:var(--ui-font-size-sm)] font-medium", classNames.trigger)}>{trigger}</Button>
    {popup.present && <div {...materialAttributes(material, { tint: "var(--overlay)" })} ref={panelRef} id={id} role="menu" data-slot="panel" className={twMerge("absolute top-full mt-[var(--ui-space-2)] min-w-48 p-[var(--ui-space-1)]", material !== false && "ui-material", placement === "end" ? "end-0" : "start-0", classNames.panel)}>{items.map((item, index) => <MenuItem key={item.id ?? index} label={item.label} href={item.href} disabled={item.disabled} destructive={item.destructive} shortcut={item.shortcut} role="menuitem" tabIndex={-1} className={classNames.item} onClick={() => { if (!current) return; item.onSelect?.(); change(false); triggerRef.current?.focus(); }} />)}</div>}
  </div>;
}
