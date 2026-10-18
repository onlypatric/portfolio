import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect } from "react";
import type { ComponentPropsWithRef } from "react";

export type ScrollViewReaderProps = UIProps & ComponentPropsWithRef<"div"> & {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  targetId?: string;
};

export function ScrollViewReader({
  behavior = "auto",
  block = "nearest",
  inline = "nearest",
  targetId,
  children,
  ...props
}: ScrollViewReaderProps) {
  useEffect(() => {
    if (!targetId) {
      return;
    }

    const scrollToTarget = () => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior,
        block,
        inline,
      });
    };

    scrollToTarget();
    window.addEventListener("astro:page-load", scrollToTarget);
    return () => window.removeEventListener("astro:page-load", scrollToTarget);
  }, [behavior, block, inline, targetId]);

  return (
    <div data-ui="ScrollViewReader" {...props} data-ohmygui-scroll-view-reader="true">
      {children}
    </div>
  );
}
