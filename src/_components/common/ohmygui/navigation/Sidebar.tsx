import { Button } from "../control/button/Button";
import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { NavigationLink } from "./NavigationLink";
import type { NavigationItem } from "./_types";
import type { UIProps } from "../_types";
import "../theme.css";
import { materialAttributes, type MaterialProps } from "../_material";

export type SidebarProps = UIProps & MaterialProps & Omit<ComponentPropsWithoutRef<"nav">, "children"> & {
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  currentPath?: string;
  items: NavigationItem[];
  title?: string;
  classNames?: Partial<Record<"header" | "title" | "toggle" | "list" | "link", string>>;
};

export function Sidebar({ className, classNames = {}, collapsible = false, collapsed, defaultCollapsed = false, onCollapsedChange, currentPath, items, material = false, style, title = "Navigation", ...props }: SidebarProps) {
  const appearance = materialAttributes(material);
  const [internal, setInternal] = useState(defaultCollapsed);
  const closed = collapsible && (collapsed ?? internal);
  const id = useId(), list = useRef<HTMLDivElement>(null), toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (closed && list.current?.contains(document.activeElement)) toggle.current?.focus(); }, [closed]);
  return <nav {...props} {...appearance} style={{ ...appearance.style, ...style }} data-ui="Sidebar" aria-label={props["aria-label"] ?? title} className={twMerge("ui-sidebar", material !== false && "ui-material", className)}>
    <div data-slot="header" className={classNames.header}>
      <h2 data-slot="title" className={classNames.title}>{title}</h2>
      {collapsible && <Button variant="unstyled" ref={toggle} type="button" data-slot="toggle" aria-expanded={!closed} aria-controls={id}
        aria-label={(closed ? "Expand " : "Collapse ") + title} className={classNames.toggle}
        onClick={() => { if (collapsed === undefined) setInternal(!closed); onCollapsedChange?.(!closed); }}>
        <span aria-hidden="true">{closed ? "+" : "−"}</span>
      </Button>}
    </div>
    <div ref={list} id={id} data-slot="disclosure" data-collapsed={closed} inert={closed || undefined} aria-hidden={closed || undefined}>
      <div><ul data-slot="list" className={classNames.list}>
        {items.map((item, index) => <li key={item.id ?? String(index)}>
          {item.href ? <NavigationLink href={item.href} state={item.current || item.href === currentPath ? "active" : "inactive"} disabled={item.disabled} className={classNames.link}>
            <span className="flex w-full min-w-0 items-center justify-between gap-[var(--ui-space-2)]">{item.label}{item.badge}</span>
          </NavigationLink> : <span className="block px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-[length:var(--ui-font-size-sm)] text-[var(--muted)]">{item.label}</span>}
        </li>)}
      </ul></div>
    </div>
  </nav>;
}
