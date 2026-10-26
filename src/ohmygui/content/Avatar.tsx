import "../theme.css";
import "../theme/design-system.css";
import { useEffect, useState, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import { sizeValue } from "./_types";

const sizes = { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem", xl: "4rem" } as const;
export type AvatarProps = UIProps & Omit<ComponentPropsWithRef<"span">, "children"> & {
  palette?: "neutral" | "auto" | "sand" | "sage" | "lilac" | "sky";
  identity?: string;
  presence?: "online" | "away" | "offline";
  alt?: string; initials?: string; size?: keyof typeof sizes | number | string; src?: string;
  shape?: "circle" | "rounded" | "square";
  classNames?: Partial<Record<"image" | "fallback", string>>;
};
export function Avatar({ palette = "neutral", identity, presence, alt = "", className, classNames = {}, initials, shape = "circle", size = "md", src, style, ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const dimension = typeof size === "string" && size in sizes ? sizes[size as keyof typeof sizes] : sizeValue(size);
  const fallback = initials ?? alt.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const colors = ["sand", "sage", "lilac", "sky"];
  const hash = Array.from(identity ?? alt).reduce((value, char) => (value * 31 + char.codePointAt(0)!) >>> 0, 0);
  const color = palette === "auto" ? colors[hash % colors.length] : palette;
  return <span {...props} data-ui="Avatar" data-palette={color === "neutral" ? undefined : color} data-presence={presence} data-shape={shape} style={{ width: dimension, height: dimension, ...style }} className={twMerge("ui-avatar inline-flex shrink-0 items-center justify-center overflow-hidden font-medium", color === "neutral" && "bg-[var(--surface-tertiary)] text-[var(--surface-tertiary-foreground)]", presence && "relative overflow-visible", shape === "circle" ? "rounded-full" : shape === "rounded" ? "rounded-[var(--radius)]" : "", className)}>
    {src && !failed ? <img data-slot="image" src={src} alt={alt} onError={() => setFailed(true)} className={twMerge("size-full object-cover", classNames.image)} /> : <span data-slot="fallback" role={alt ? "img" : undefined} aria-label={alt || undefined} className={classNames.fallback}>{fallback || "?"}</span>}
    {presence && <span data-slot="presence" role="img" aria-label={presence} />}
  </span>;
}
