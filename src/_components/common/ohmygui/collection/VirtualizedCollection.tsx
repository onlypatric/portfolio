import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { defaultItemKey, type ItemKey, type ItemRenderer } from "./_types";

export type VirtualizedCollectionProps<T> = UIProps & Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  estimateSize: number;
  getKey?: ItemKey<T>;
  items: readonly T[];
  overscan?: number;
  render: ItemRenderer<T>;
};

export function VirtualizedCollection<T>({ className, estimateSize, getKey = defaultItemKey, items, overscan = 3, render, ...props }: VirtualizedCollectionProps<T>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(480);
  const [scrollTop, setScrollTop] = useState(0);
  const start = Math.max(0, Math.floor(scrollTop / estimateSize) - overscan);
  const end = Math.min(items.length, Math.ceil((scrollTop + viewportHeight) / estimateSize) + overscan);
  const visible = useMemo(() => items.slice(start, end), [end, items, start]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onScroll = () => setScrollTop(viewport.scrollTop);
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(([entry]) => { if (entry) setViewportHeight(entry.contentRect.height); });
    viewport.addEventListener("scroll", onScroll, { passive: true });
    observer?.observe(viewport);
    return () => { viewport.removeEventListener("scroll", onScroll); observer?.disconnect(); };
  }, []);

  return (
    <div data-ui="VirtualizedCollection" {...props} ref={viewportRef} tabIndex={0} className={twMerge("relative h-full min-h-32 overflow-auto focus-visible:outline-2 focus-visible:outline-[var(--focus)]", className)}>
      <div style={{ height: items.length * estimateSize }} aria-setsize={items.length}>
        {visible.map((item, visibleIndex) => { const index = start + visibleIndex; return <div key={getKey(item, index)} aria-posinset={index + 1} style={{ position: "absolute", insetInline: 0, top: index * estimateSize, minHeight: estimateSize }}>{render(item, index)}</div>; })}
      </div>
    </div>
  );
}
