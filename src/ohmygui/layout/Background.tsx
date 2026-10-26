import type { UIProps } from "../_types";
import "../theme.css";
import { twMerge } from "tailwind-merge";
import { type ComponentPropsWithRef, type CSSProperties, type ElementType } from "react";

export type BackgroundProps = UIProps & ComponentPropsWithRef<"div"> & {
  /** Blur a separate decorative background layer, never the children. */
  decorativeBlur?: string;
  clip?: "border-box" | "padding-box" | "content-box" | "text" | "none";
  fill?: string;
  image?: string;
  as?: ElementType;
};

export function Background({
  children,
  className,
  clip = "border-box",
  decorativeBlur,
  fill,
  image,
  as,
  style,
  ...props
}: BackgroundProps) {
  const Component = as ?? "div";
  const isGradient = /^(?:linear|radial|conic)-gradient\(/.test(fill ?? "");
  const backgroundImage = image
    ? /^(?:url\(|(?:linear|radial|conic)-gradient\()/.test(image)
      ? image
      : `url(${JSON.stringify(image)})`
    : isGradient
      ? fill
      : undefined;
  const backgroundStyle: CSSProperties = {
    backgroundColor: isGradient ? undefined : fill,
    backgroundImage,
    backgroundClip: clip === "none" ? undefined : clip,
    ...style,
  };

  return (
    <Component data-ui="Background" {...props} style={decorativeBlur ? { ...backgroundStyle, backgroundImage: undefined, backgroundColor: undefined, "--ui-decorative-image": backgroundImage ?? "none", "--ui-decorative-fill": isGradient ? undefined : fill, "--ui-content-blur": decorativeBlur, ...style } : backgroundStyle} className={twMerge(decorativeBlur && "ui-background-blur", className)}>
      {decorativeBlur && <span aria-hidden="true" data-slot="background" />}
      {children}
    </Component>
  );
}
