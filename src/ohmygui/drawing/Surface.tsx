import type { ComponentPropsWithRef, ElementType } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import { materialAttributes, type MaterialProps } from "../_material";
import { surfaceAttributes, type SurfaceOptions } from "../theme/_appearance";
import "../theme.css";
import "../theme/design-system.css";

export type SurfaceProps = UIProps & MaterialProps & ComponentPropsWithRef<"div"> & SurfaceOptions & { as?: ElementType };
/** Shared visual owner. Native semantics remain the caller's choice. */
export function Surface({ as: Element = "div", appearance, tone, padding, radius, material = false, className, style, ...props }: SurfaceProps) {
  const surface = surfaceAttributes({ appearance, tone, padding, radius });
  const backdrop = materialAttributes(material);
  return <Element data-ui="Surface" {...props} {...surface} {...(material !== false ? backdrop : {})} className={twMerge("ui-surface", material !== false && "ui-material", className)} style={{ ...surface.style, ...(material !== false ? backdrop.style : {}), ...style }} />;
}
