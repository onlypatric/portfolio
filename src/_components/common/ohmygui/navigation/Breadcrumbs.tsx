import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { NavigationItem } from "./_types";
import type { UIProps } from "../_types";
import "../theme.css";
import { usePopupMotion, type PopupAnimationProps } from "../_usePopupMotion";

export type BreadcrumbsProps = UIProps & PopupAnimationProps & Omit<ComponentPropsWithoutRef<"nav">, "children"> & {
  items: NavigationItem[];
  /** Middle ancestors move into a native disclosure above this count. */
  maxItems?: number;
  classNames?: Partial<Record<"list" | "item" | "link" | "disclosure", string>>;
};

function Ancestors({ children, className, openingAnimation, closingAnimation }: PopupAnimationProps & { children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDetailsElement>(null), trigger = useRef<HTMLElement>(null), panel = useRef<HTMLUListElement>(null);
  const popup = usePopupMotion(open, { panelRef: panel, triggerRef: trigger, openingAnimation, closingAnimation });
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside); return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return <details ref={root} data-slot="disclosure" className={className} open={popup.present}
    onToggle={event => { if (!event.currentTarget.open) setOpen(false); else if (!popup.present) setOpen(true); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}
    onKeyDown={event => { if (open && event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus(); } }}>
    <summary ref={trigger} aria-label="Show ancestor pages" aria-expanded={open} onClick={event => { event.preventDefault(); setOpen(!open); }}>…</summary>
    <ul ref={panel} onClick={event => { if ((event.target as Element).closest("a[href]")) setOpen(false); }}>{children}</ul>
  </details>;
}

export function Breadcrumbs({ className, classNames = {}, items, maxItems = 4, openingAnimation, closingAnimation, ...props }: BreadcrumbsProps) {
  const limit = Math.max(3, Number.isFinite(maxItems) ? Math.floor(maxItems) : items.length);
  const collapsed = items.length > limit, tail = items.length - (limit - 2);
  const renderItem = (item: NavigationItem, index: number) => item.href && index < items.length - 1
    ? <a data-slot="link" href={item.disabled ? undefined : item.href} role={item.disabled ? "link" : undefined} aria-disabled={item.disabled || undefined} className={classNames.link}>{item.label}</a>
    : <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>;
  return <nav {...props} data-ui="Breadcrumbs" aria-label={props["aria-label"] ?? "Breadcrumb"} className={twMerge("ui-breadcrumbs", className)}>
    <ol data-slot="list" className={classNames.list}>
      {items.map((item, index) => {
        if (collapsed && index > 1 && index < tail) return null;
        return <li key={item.id ?? String(index)} data-slot="item" className={classNames.item}>
          {index > 0 && <span aria-hidden="true">/</span>}
          {collapsed && index === 1 ? <Ancestors className={classNames.disclosure} openingAnimation={openingAnimation} closingAnimation={closingAnimation}>
            {items.slice(1, tail).map((ancestor, offset) => <li key={ancestor.id ?? String(offset)}>{renderItem(ancestor, offset + 1)}</li>)}
          </Ancestors> : renderItem(item, index)}
        </li>;
      })}
    </ol>
  </nav>;
}
