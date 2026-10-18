import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

const variantMap = {
  default: "text-[var(--accent)] underline decoration-current/40 underline-offset-4 hover:decoration-current",
  quiet: "text-[var(--foreground)] underline decoration-current/40 underline-offset-4 hover:decoration-current",
  button: "inline-flex items-center rounded-[var(--field-radius)] bg-[var(--accent)] px-[var(--ui-space-3)] py-[var(--ui-space-2)] font-medium text-[var(--accent-foreground)] no-underline hover:opacity-90",
} as const;

export type LinkProps = UIProps & Omit<ComponentPropsWithRef<"a">, "href"> & {
  href: string;
  variant?: keyof typeof variantMap;
};

export function Link({
  children,
  className,
  rel,
  target,
  variant = "default",
  ...props
}: LinkProps) {
  const safeRel =
    target === "_blank" && !rel ? "noopener noreferrer" : rel;

  return (
    <a data-ui="Link"
      {...props}
      target={target}
      rel={safeRel}
      className={twMerge(
        clsx(
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
          variantMap[variant],
          className,
        ),
      )}
    >
      {children}
    </a>
  );
}
