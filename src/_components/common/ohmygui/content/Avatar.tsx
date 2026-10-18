import "../theme.css";
import { useEffect, useState, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import { sizeValue } from "./_types";

const sizes = { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem", xl: "4rem" } as const;
export type AvatarProps = UIProps & Omit<ComponentPropsWithRef<"span">, "children"> & {
  alt?: string; initials?: string; size?: keyof typeof sizes | number | string; src?: string;
  shape?: "circle" | "rounded" | "square";
  classNames?: Partial<Record<"image" | "fallback", string>>;
};
export function Avatar({ alt = "", className, classNames = {}, initials, shape = "circle", size = "md", src, style, ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const dimension = typeof size === "string" && size in sizes ? sizes[size as keyof typeof sizes] : sizeValue(size);
  const fallback = initials ?? alt.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <span {...props} data-ui="Avatar" data-shape={shape} style={{ width: dimension, height: dimension, ...style }} className={twMerge("inline-flex shrink-0 items-center justify-center overflow-hidden bg-[var(--surface-tertiary)] text-[var(--surface-tertiary-foreground)] font-medium", shape === "circle" ? "rounded-full" : shape === "rounded" ? "rounded-[var(--radius)]" : "", className)}>
    {src && !failed ? <img data-slot="image" src={src} alt={alt} onError={() => setFailed(true)} className={twMerge("size-full object-cover", classNames.image)} /> : <span data-slot="fallback" role={alt ? "img" : undefined} aria-label={alt || undefined} className={classNames.fallback}>{fallback || "?"}</span>}
  </span>;
}
