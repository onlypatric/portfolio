import "../theme.css";
import { useEffect, useRef, type CanvasHTMLAttributes, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
export type CanvasProps = UIProps & Omit<CanvasHTMLAttributes<HTMLCanvasElement>, "children"> & {
  draw?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  fallback?: ReactNode; resolution?: number; wrapperProps?: ComponentPropsWithoutRef<"div">;
};
export function Canvas({ className, draw, fallback, height = 180, resolution = 1, width = 320, wrapperProps, ...props }: CanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas || !draw) return;
    const paint = () => {
      if (document.hidden) return;
      const rect = canvas.getBoundingClientRect(), ratio = Math.max(1, resolution * (window.devicePixelRatio || 1));
      canvas.width = Math.max(1, Math.round(rect.width * ratio)); canvas.height = Math.max(1, Math.round(rect.height * ratio));
      const context = canvas.getContext("2d"); if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0); draw(context, canvas);
    };
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(paint);
    observer?.observe(canvas); document.addEventListener("visibilitychange", paint); paint();
    return () => { observer?.disconnect(); document.removeEventListener("visibilitychange", paint); };
  }, [draw, height, resolution, width]);
  return <div {...wrapperProps} data-ui="Canvas" className={twMerge("relative max-w-full", wrapperProps?.className)} style={{ width, aspectRatio: Number(width) / Number(height), ...wrapperProps?.style }}>
    <canvas {...props} data-slot="canvas" ref={ref} width={width} height={height} className={twMerge("block h-full w-full", className)}>{fallback}</canvas>{fallback && <noscript>{fallback}</noscript>}
  </div>;
}
