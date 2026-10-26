import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { mergeStyle } from "./_types";

export type GeometrySize = {
  height: number;
  width: number;
};

export type GeometryReaderProps = UIProps & Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  children?: ReactNode | ((size: GeometrySize) => ReactNode);
  observe?: boolean;
  onResize?: (size: GeometrySize) => void;
};

export function GeometryReader({
  children,
  observe = true,
  onResize,
  style,
  ...props
}: GeometryReaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<GeometrySize>({ height: 0, width: 0 });

  useEffect(() => {
    if (!observe || !ref.current || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      const nextSize = {
        height: entry.contentRect.height,
        width: entry.contentRect.width,
      };
      setSize(nextSize);
      onResize?.(nextSize);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [observe, onResize]);

  return (
    <div data-ui="GeometryReader"
      {...props}
      ref={ref}
      style={mergeStyle(style, { containerType: "inline-size" })}
    >
      {typeof children === "function" ? children(size) : children}
    </div>
  );
}
