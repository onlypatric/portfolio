import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export type ImageFit = "contain" | "cover" | "fill" | "none" | "scale-down";

export type ImageSource = {
  media?: string;
  sizes?: string;
  srcSet: string;
  type?: string;
};

export type ImageProps = UIProps & Omit<ComponentPropsWithRef<"img">, "alt" | "src"> & {
  /** Only decorative images (alt="") are filtered. Never use blur as redaction. */
  decorativeBlur?: string;
  alt: string;
  fit?: ImageFit;
  sources?: ImageSource[];
  src: string;
};

const fitClassMap = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
} as const;

export function Image({
  alt,
  className,
  decorativeBlur,
  fit = "contain",
  loading = "lazy",
  sources,
  src,
  style,
  ...props
}: ImageProps) {
  const image = (
    <img data-ui="Image"
      {...props}
      alt={alt}
      loading={loading}
      src={src}
      data-decorative-blur={alt === "" && decorativeBlur ? "true" : undefined}
      style={{ ...(alt === "" && decorativeBlur ? { "--ui-content-blur": decorativeBlur } : {}), ...style }}
      className={twMerge(clsx("block max-w-full", fitClassMap[fit], alt === "" && decorativeBlur && "ui-decorative-blur", className))}
    />
  );

  if (!sources?.length) {
    return image;
  }

  return (
    <picture data-ui="Image">
      {sources.map((source, index) => (
        <source key={index} {...source} />
      ))}
      {image}
    </picture>
  );
}
