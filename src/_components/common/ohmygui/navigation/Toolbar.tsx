import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import "../theme.css";
import { materialAttributes, type MaterialProps } from "../_material";

export type ToolbarProps = UIProps & MaterialProps & ComponentPropsWithoutRef<"header"> & {
  children?: ReactNode;
  density?: "comfortable" | "compact";
  label?: string;
  overflow?: ReactNode;
  orientation?: "horizontal" | "vertical";
  classNames?: Partial<Record<"items" | "overflow", string>>;
};

export function Toolbar({ children, className, classNames = {}, density = "comfortable", label = "Toolbar", material = false, overflow, orientation = "horizontal", onKeyDown, style, ...props }: ToolbarProps) {
  const appearance = materialAttributes(material);
  const root = useRef<HTMLElement>(null);
  return <header {...props} {...appearance} style={{ ...appearance.style, ...style }} ref={root} data-ui="Toolbar" role="toolbar" aria-label={props["aria-label"] ?? label}
    aria-orientation={orientation} data-density={density} data-orientation={orientation} className={twMerge("ui-toolbar", material !== false && "ui-material", className)}
    onKeyDown={(event) => {
      onKeyDown?.(event); if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement;
      // Arrow keys belong to editable controls, sliders and other composite widgets.
      if (!target.matches("button, a[href]") || target.closest('[role="tablist"], [role="menu"], [role="combobox"]')) return;
      const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
      const previous = orientation === "vertical" ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
      const next = orientation === "vertical" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
      if (![previous, next, "Home", "End"].includes(event.key)) return;
      const controls = Array.from(root.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]:not([aria-disabled="true"])') ?? [])
        .filter((element) => element.getClientRects().length && !element.closest("[inert], [hidden]"));
      const index = controls.indexOf(target); if (index < 0 || !controls.length) return;
      event.preventDefault();
      controls[event.key === "Home" ? 0 : event.key === "End" ? controls.length - 1 : (index + (event.key === next ? 1 : -1) + controls.length) % controls.length].focus();
    }}>
    <div data-slot="items" className={classNames.items}>{children}</div>
    {overflow && <div data-slot="overflow" className={classNames.overflow}>{overflow}</div>}
  </header>;
}
