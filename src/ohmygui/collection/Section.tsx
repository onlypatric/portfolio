import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type SectionProps = UIProps & ComponentPropsWithoutRef<"section"> & {
  collapsible?: boolean;
  footer?: ReactNode;
  title?: ReactNode;
};

export function Section({ children, className, collapsible = false, footer, title, ...props }: SectionProps) {
  const content = (
    <>
      {title !== undefined && <div className="mb-[var(--ui-space-2)] text-[length:var(--ui-font-size-sm)] font-semibold text-[var(--foreground)]">{title}</div>}
      {children}
      {footer !== undefined && <div className="mt-[var(--ui-space-3)] text-[length:var(--ui-font-size-sm)] text-[var(--muted)]">{footer}</div>}
    </>
  );

  return collapsible ? (
    <details data-ui="Section" {...props} className={twMerge("rounded-[var(--field-radius)]", className)}>
      {title !== undefined && <summary className="cursor-pointer font-semibold">{title}</summary>}
      <div className="mt-[var(--ui-space-2)]">{children}</div>
      {footer !== undefined && <div className="mt-[var(--ui-space-3)] text-[length:var(--ui-font-size-sm)] text-[var(--muted)]">{footer}</div>}
    </details>
  ) : (
    <section data-ui="Section" {...props} className={twMerge("min-w-0", className)}>{content}</section>
  );
}
