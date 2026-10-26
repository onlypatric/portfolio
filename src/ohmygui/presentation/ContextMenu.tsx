import "../theme.css";
import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Menu, type MenuProps } from "./Menu";
import type { UIProps } from "../_types";
import type { MaterialProps } from "../_material";
import type { PopupAnimationProps } from "../_usePopupMotion";

export type ContextMenuProps = UIProps & MaterialProps & PopupAnimationProps & ComponentPropsWithoutRef<"div"> & {
  items: MenuProps["items"];
  target?: ReactNode;
  classNames?: MenuProps["classNames"];
};
export function ContextMenu({ children, className, classNames, items, material, openingAnimation, closingAnimation, onContextMenu, target = "More actions", ...props }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  return <div {...props} data-ui="ContextMenu" className={twMerge("relative inline-flex items-center gap-[var(--ui-space-2)]", className)} onContextMenu={(event) => { onContextMenu?.(event); if (!event.defaultPrevented) { event.preventDefault(); setOpen(true); } }}>
    {children}<Menu material={material} openingAnimation={openingAnimation} closingAnimation={closingAnimation} items={items} open={open} onOpenChange={setOpen} trigger={target} classNames={classNames} placement="end" />
  </div>;
}
