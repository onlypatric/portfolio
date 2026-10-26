import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type AttributedTextRun =
  | string
  | {
      code?: boolean;
      emphasis?: boolean;
      href?: string;
      rel?: string;
      strong?: boolean;
      target?: "_blank" | "_parent" | "_self" | "_top";
      text: string;
    };

export type AttributedTextProps = UIProps & Omit<
  ComponentPropsWithRef<"span">,
  "children" | "ref"
> & {
  as?: "span" | "p" | "div";
  runs: AttributedTextRun[];
};

function renderRun(run: AttributedTextRun, index: number): ReactNode {
  const value = typeof run === "string" ? run : run.text;
  if (typeof run === "string") {
    return <span key={index}>{value}</span>;
  }

  let content: ReactNode = value;
  if (run.code) content = <code>{content}</code>;
  if (run.strong) content = <strong>{content}</strong>;
  if (run.emphasis) content = <em>{content}</em>;
  if (run.href) {
    content = (
      <a
        href={run.href}
        target={run.target}
        rel={run.rel ?? (run.target === "_blank" ? "noopener noreferrer" : undefined)}
        className="text-[var(--accent)] underline underline-offset-4"
      >
        {content}
      </a>
    );
  }

  return <span key={index}>{content}</span>;
}

export function AttributedText({
  as = "span",
  className,
  runs,
  ...props
}: AttributedTextProps) {
  const Component = as;

  return (
    <Component data-ui="AttributedText" {...props} className={twMerge(clsx("min-w-0", className))}>
      {runs.map(renderRun)}
    </Component>
  );
}
