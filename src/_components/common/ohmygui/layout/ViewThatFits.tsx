import type { UIProps } from "../_types";
import "../theme.css";
import { Children, useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { cssSize } from "./_types";

export type ViewThatFitsPolicy =
  | "container"
  | "viewport"
  | Array<number | string>
  | {
      mode?: "container" | "viewport";
      thresholds?: Array<number | string>;
    };

export type ViewThatFitsProps = UIProps & Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  breakpointPolicy?: ViewThatFitsPolicy;
  children?: ReactNode;
  variants?: ReactNode[];
};

function thresholdValues(policy: ViewThatFitsPolicy | undefined, count: number) {
  const defaultThresholds = Array.from(
    { length: Math.max(0, count - 1) },
    (_, index) => `${480 + index * 160}px`,
  );

  if (!policy || typeof policy === "string") {
    return defaultThresholds;
  }

  return Array.isArray(policy)
    ? policy.map(cssSize)
    : (policy.thresholds?.map(cssSize) ?? defaultThresholds);
}

export function ViewThatFits({
  breakpointPolicy = "container",
  children,
  className,
  style,
  variants,
  ...props
}: ViewThatFitsProps) {
  const options = variants ?? Children.toArray(children);
  const scope = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const mode =
    typeof breakpointPolicy === "object" && !Array.isArray(breakpointPolicy)
      ? (breakpointPolicy.mode ?? "container")
      : typeof breakpointPolicy === "string"
        ? breakpointPolicy
        : "container";
  const thresholds = thresholdValues(breakpointPolicy, options.length);
  const selector = `[data-ohmygui-fit="${scope}"]`;
  const rules = [
    `${selector} > [data-ohmygui-fit-index] { display: none; }`,
    `${selector} > [data-ohmygui-fit-index="0"] { display: block; }`,
    ...options.slice(1).flatMap((_, index) => {
      const threshold = thresholds[index] ?? `${480 + index * 160}px`;
      const query = mode === "viewport" ? "@media" : "@container";
      return [
        `${query} (min-width: ${threshold}) { ${selector} > [data-ohmygui-fit-index] { display: none; } ${selector} > [data-ohmygui-fit-index="${index + 1}"] { display: block; } }`,
      ];
    }),
  ].join("\n");

  return (
    <div data-ui="ViewThatFits"
      {...props}
      {...(mode === "container"
        ? { style: { containerType: "inline-size", ...style } }
        : { style })}
      data-ohmygui-fit={scope}
      className={twMerge("min-w-0", className)}
    >
      <style>{rules}</style>
      {options.map((option, index) => (
        <div key={index} data-ohmygui-fit-index={index}>
          {option}
        </div>
      ))}
    </div>
  );
}
