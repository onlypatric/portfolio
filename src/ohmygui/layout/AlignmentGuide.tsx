import type { UIProps } from "../_types";
import "../theme.css";
import { type CSSProperties } from "react";
import { cssSize, type LayoutElementProps, type LayoutSize } from "./_types";

export type AlignmentGuideProps = UIProps & LayoutElementProps & {
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  offset?: LayoutSize | { block?: LayoutSize; inline?: LayoutSize };
};

export function AlignmentGuide({
  align = "start",
  children,
  offset,
  style,
  ...props
}: AlignmentGuideProps) {
  const offsetStyle: CSSProperties =
    typeof offset === "object" && offset !== null
      ? {
          translate: `${cssSize(offset.inline) ?? "0px"} ${cssSize(offset.block) ?? "0px"}`,
        }
      : { translate: `0 ${cssSize(offset) ?? "0px"}` };

  return (
    <div data-ui="AlignmentGuide"
      {...props}
      style={{
        alignSelf: align,
        ...offsetStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
