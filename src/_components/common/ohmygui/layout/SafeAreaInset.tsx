import type { UIProps } from "../_types";
import "../theme.css";
import type { ComponentPropsWithRef } from "react";
import { spacingValue, type LayoutSpacing } from "./_types";

export type SafeAreaEdge = "top" | "bottom" | "leading" | "trailing";

export type SafeAreaInsetProps = UIProps & ComponentPropsWithRef<"div"> & {
  edges?: SafeAreaEdge | SafeAreaEdge[];
  spacing?: LayoutSpacing;
};

export function SafeAreaInset({
  children,
  edges = ["top", "bottom", "leading", "trailing"],
  spacing = "none",
  style,
  ...props
}: SafeAreaInsetProps) {
  const edgeList = Array.isArray(edges) ? edges : [edges];
  const spacingCss = spacingValue(spacing) ?? "0px";
  const has = (edge: SafeAreaEdge) => edgeList.includes(edge);

  return (
    <div data-ui="SafeAreaInset"
      {...props}
      style={{
        ...(has("top")
          ? { paddingBlockStart: `calc(env(safe-area-inset-top) + ${spacingCss})` }
          : {}),
        ...(has("bottom")
          ? { paddingBlockEnd: `calc(env(safe-area-inset-bottom) + ${spacingCss})` }
          : {}),
        ...(has("leading")
          ? { paddingInlineStart: `calc(env(safe-area-inset-left) + ${spacingCss})` }
          : {}),
        ...(has("trailing")
          ? { paddingInlineEnd: `calc(env(safe-area-inset-right) + ${spacingCss})` }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
