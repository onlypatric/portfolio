import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type NavigationTitleProps = UIProps & Omit<ComponentPropsWithoutRef<"header">, "children"> & {
  subtitle?: ReactNode;
  title: ReactNode;
  level?: 1 | 2 | 3;
  leading?: ReactNode;
  trailing?: ReactNode;
  classNames?: Partial<Record<"title" | "subtitle" | "leading" | "trailing" | "text", string>>;
};

export function NavigationTitle({ className, classNames = {}, subtitle, title, level = 1, leading, trailing, ...props }: NavigationTitleProps) {
  const Heading = level === 3 ? "h3" : level === 2 ? "h2" : "h1";
  return (
    <header data-ui="NavigationTitle" {...props} className={twMerge("flex min-w-0 flex-wrap items-center gap-[var(--ui-space-3)]", className)}>
      {leading && <div data-slot="leading" className={classNames.leading}>{leading}</div>}
      <div data-slot="text" className={twMerge("grid min-w-0 flex-1 gap-[var(--ui-space-1)]", classNames.text)}>
        <Heading data-slot="title" className={twMerge("text-[length:var(--ui-font-size-3xl)] font-semibold tracking-tight", classNames.title)}>{title}</Heading>
        {subtitle != null && <p data-slot="subtitle" className={twMerge("text-[length:var(--ui-font-size-sm)] text-[var(--muted)]", classNames.subtitle)}>{subtitle}</p>}
      </div>
      {trailing && <div data-slot="trailing" className={classNames.trailing}>{trailing}</div>}
    </header>
  );
}
