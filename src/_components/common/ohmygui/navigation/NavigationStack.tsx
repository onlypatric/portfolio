import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Breadcrumbs } from "./Breadcrumbs";
import type { NavigationItem } from "./_types";

export type NavigationStackProps = UIProps & Omit<ComponentPropsWithoutRef<"main">, "children"> & {
  basePath?: string;
  breadcrumbs?: NavigationItem[];
  children?: ReactNode;
  title?: ReactNode;
  as?: "main" | "section";
  backHref?: string;
  backLabel?: string;
  /** Changing this key animates and remounts the destination body. */
  transitionKey?: string | number;
  classNames?: Partial<Record<"header" | "title" | "body" | "back", string>>;
};

export function NavigationStack({ as: Component = "main", basePath, breadcrumbs, children, className, classNames = {}, title, backHref, backLabel = "Back", transitionKey, ...props }: NavigationStackProps) {
  return (
    <Component data-ui="NavigationStack" {...props} data-base-path={basePath} className={twMerge("grid gap-[var(--ui-space-4)]", className)}>
      {(title != null || breadcrumbs || backHref) && (
        <header data-slot="header" className={twMerge("grid min-w-0 gap-[var(--ui-space-2)]", classNames.header)}>
          {backHref && <a data-slot="back" href={backHref} className={twMerge("inline-flex min-h-[var(--ui-nav-target)] w-fit items-center gap-[var(--ui-space-2)]", classNames.back)}><span aria-hidden="true">←</span>{backLabel}</a>}
          {title != null && <h1 data-slot="title" className={twMerge("text-[length:var(--ui-font-size-2xl)] font-semibold", classNames.title)}>{title}</h1>}
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        </header>
      )}
      <div key={transitionKey} data-slot="body" data-animated={transitionKey !== undefined} className={twMerge("min-w-0", classNames.body)}>{children}</div>
    </Component>
  );
}
