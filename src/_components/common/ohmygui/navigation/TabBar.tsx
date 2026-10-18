import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { NavigationLink } from "./NavigationLink";
import type { NavigationItem } from "./_types";
import type { UIProps } from "../_types";
import "../theme.css";
import { TabContent } from "./_TabContent";
import { attachTabIndicator } from "./_tabIndicator";
import { materialAttributes, type MaterialProps } from "../_material";

export type TabBarProps = UIProps & MaterialProps & Omit<ComponentPropsWithoutRef<"nav">, "children"> & {
  items: NavigationItem[];
  placement?: "bottom" | "top";
  /** Sticky within the owning scroll container, not a fixed page overlay. */
  sticky?: boolean;
  classNames?: Partial<Record<"list" | "item" | "link" | "icon" | "label" | "badge", string>>;
};
export function TabBar({ className, classNames = {}, items, material = { blur: "20px" }, placement = "bottom", sticky = false, ...props }: TabBarProps) {
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => { if (list.current) return attachTabIndicator(list.current); }, []);
  return <nav {...props} data-ui="TabBar" aria-label={props["aria-label"] ?? "Tabs"} data-placement={placement} data-sticky={sticky}
    className={twMerge("ui-tab-bar", className)}>
    <ul ref={list} {...materialAttributes(material)} data-slot="list" className={twMerge("ui-material", classNames.list)}>
      {items.map((item, index) => <li key={item.id ?? String(index)} className={classNames.item}>
        <NavigationLink href={item.href} state={item.current ? "active" : "inactive"} disabled={item.disabled || !item.href}
          data-has-icon={(item.current ? item.selectedIcon ?? item.icon : item.icon) != null}
          className={twMerge("ui-tab rounded-[1.75rem] font-semibold text-[var(--muted)] data-[has-icon=true]:text-[.6875rem] aria-[current=page]:text-[var(--accent)]", classNames.link)}>
          <TabContent active={!!item.current} {...item} classNames={classNames} />
        </NavigationLink>
      </li>)}
    </ul>
  </nav>;
}
