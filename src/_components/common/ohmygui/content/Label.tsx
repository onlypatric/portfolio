import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type LabelProps = UIProps & Omit<ComponentPropsWithRef<"span">, "title"> & {
  icon?: ReactNode;
  iconPosition?: "leading" | "trailing";
  title?: ReactNode;
};

export function Label({
  children,
  className,
  icon,
  iconPosition = "leading",
  title,
  ...props
}: LabelProps) {
  const content = title ?? children;
  const iconSlot = icon ? (
    <span data-slot="icon" aria-hidden="true" className="inline-flex shrink-0">
      {icon}
    </span>
  ) : null;

  return (
    <span data-ui="Label"
      {...props}
      className={twMerge(
        clsx("inline-flex min-w-0 items-center gap-[var(--ui-space-2)]", className),
      )}
    >
      {iconPosition === "leading" && iconSlot}
      <span data-slot="title" className="min-w-0">{content}</span>
      {iconPosition === "trailing" && iconSlot}
    </span>
  );
}
