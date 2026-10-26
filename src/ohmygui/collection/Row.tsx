import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import "../theme/design-system.css";
export type RowProps = UIProps & Omit<ComponentPropsWithRef<"div">, "title"> & { as?: ElementType; title?: ReactNode; description?: ReactNode; leading?: ReactNode; trailing?: ReactNode; divider?: boolean; fill?: boolean };
/** Phrasing-only slots also permit use as a span inside a real Button. */
export function Row({ as: Element = "div", title, description, leading, trailing, children, divider = false, fill = true, className, ...props }: RowProps) {
  return <Element {...props} data-ui="Row" data-divider={divider || undefined} data-fill={fill || undefined} className={twMerge("ui-row", className)}>
    {leading != null && <span data-slot="leading">{leading}</span>}
    <span data-slot="body">{title != null && <span data-slot="title">{title}</span>}{description != null && <span data-slot="description">{description}</span>}{children}</span>
    {trailing != null && <span data-slot="trailing">{trailing}</span>}
  </Element>;
}
