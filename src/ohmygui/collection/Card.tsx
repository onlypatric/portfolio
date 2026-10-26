import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Surface, type SurfaceProps } from "../drawing/Surface";
export type CardProps = SurfaceProps & { header?: ReactNode; footer?: ReactNode; fill?: boolean };
export function Card({ as = "section", children, header, footer, fill = false, className, ...props }: CardProps) {
  return <Surface as={as} data-ui="Card" data-fill={fill || undefined} {...props} className={twMerge("ui-card", className)}>
    {header != null && <div data-slot="header">{header}</div>}
    <div data-slot="body">{children}</div>
    {footer != null && <div data-slot="footer">{footer}</div>}
  </Surface>;
}
