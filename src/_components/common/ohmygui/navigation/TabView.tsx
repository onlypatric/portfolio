import "../theme.css";
import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import { Tab } from "./Tab";
import type { NavigationTab } from "./_types";
import { materialAttributes, type MaterialProps } from "../_material";

export type TabViewProps = UIProps & MaterialProps & Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  activationMode?: "automatic" | "manual";
  active?: string;
  defaultActive?: string;
  onActiveChange?: (id: string) => void;
  tabs: NavigationTab[];
  label?: string;
  orientation?: "horizontal" | "vertical";
  keepMounted?: boolean;
  classNames?: Partial<Record<"list" | "tab" | "panel", string>>;
};
export function TabView({ activationMode = "automatic", active, defaultActive, className, classNames = {}, keepMounted = true, label = "Sections", material = { blur: "20px" }, onActiveChange, orientation = "horizontal", tabs, ...props }: TabViewProps) {
  const id = useId(), root = useRef<HTMLDivElement>(null), list = useRef<HTMLDivElement>(null);
  const enabled = tabs.filter((tab) => !tab.disabled);
  const [internalActive, setInternalActive] = useState(defaultActive ?? enabled[0]?.id), [focused, setFocused] = useState<string>();
  const requested = active ?? internalActive;
  const current = enabled.find((tab) => tab.id === requested)?.id ?? enabled[0]?.id;
  const focusTarget = enabled.some((tab) => tab.id === focused) ? focused : current;
  const previous = useRef(current);
  useEffect(() => {
    const changed = previous.current !== current;
    const direction = tabs.findIndex(tab => tab.id === current) >= tabs.findIndex(tab => tab.id === previous.current) ? 1 : -1;
    previous.current = current;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (!changed || motion.matches) return;
    const panel = document.getElementById(id + "-" + current + "-panel");
    const animation = panel?.animate?.([
      { opacity: 0, transform: `translate(${orientation === "vertical" ? 0 : direction * 14}px, 10px) scale(.985)` },
      { opacity: 1, transform: "translate(0, 0) scale(1)" },
    ], { id: "ui-tab-panel", duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" });
    const cancel = () => animation?.cancel();
    motion.addEventListener("change", cancel);
    return () => { cancel(); motion.removeEventListener("change", cancel); };
  }, [current, id, orientation]);
  const reveal = (button: HTMLButtonElement) => {
    const container = list.current; if (!container) return;
    const outer = container.getBoundingClientRect(), inner = button.getBoundingClientRect();
    if (orientation === "vertical") {
      if (inner.top < outer.top) container.scrollTop -= outer.top - inner.top;
      else if (inner.bottom > outer.bottom) container.scrollTop += inner.bottom - outer.bottom;
    } else {
      if (inner.left < outer.left) container.scrollLeft -= outer.left - inner.left;
      else if (inner.right > outer.right) container.scrollLeft += inner.right - outer.right;
    }
  };
  useEffect(() => {
    const button = Array.from(list.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []).find((element) => element.dataset.tab === current);
    if (button) reveal(button);
  }, [current, orientation]);
  const select = (next: string) => { if (active === undefined) setInternalActive(next); onActiveChange?.(next); };
  const focus = (next: string) => {
    setFocused(next);
    list.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach((button) => { if (button.dataset.tab === next) { button.focus({ preventScroll: true }); reveal(button); } });
    if (activationMode === "automatic") select(next);
  };
  const keydown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!enabled.length || event.altKey || event.ctrlKey || event.metaKey) return;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const previousKey = orientation === "vertical" ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
    const nextKey = orientation === "vertical" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
    if (![previousKey, nextKey, "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const source = (event.target as HTMLElement).closest<HTMLElement>('[role="tab"]')?.dataset.tab;
    const index = Math.max(0, enabled.findIndex((tab) => tab.id === source));
    const next = event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index + (event.key === nextKey ? 1 : -1) + enabled.length) % enabled.length;
    focus(enabled[next].id);
  };
  return <div {...props} data-ui="TabView" ref={root} className={twMerge("grid gap-[var(--ui-space-3)]", className)}>
    <div ref={list} {...materialAttributes(material)} data-slot="list" role="tablist" aria-label={label} aria-orientation={orientation} onKeyDown={keydown}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(undefined); }}
      className={twMerge("ui-tab-list ui-material", classNames.list)}>
      {tabs.map((tab) => <Tab key={tab.id} id={id + "-" + tab.id + "-tab"} data-tab={tab.id} label={tab.label} icon={tab.icon} selectedIcon={tab.selectedIcon} badge={tab.badge} disabled={tab.disabled} active={tab.id === current} tabIndex={!tab.disabled && focusTarget === tab.id ? 0 : -1} onFocus={() => setFocused(tab.id)} onClick={() => { setFocused(tab.id); select(tab.id); }} aria-controls={id + "-" + tab.id + "-panel"} className={classNames.tab} />)}
    </div>
    {tabs.map((tab) => <section key={tab.id} data-slot="panel" hidden={tab.id !== current} id={id + "-" + tab.id + "-panel"} role="tabpanel" aria-labelledby={id + "-" + tab.id + "-tab"} tabIndex={0} className={twMerge("min-w-0", classNames.panel)}>{(keepMounted || tab.id === current) && tab.content}</section>)}
  </div>;
}
