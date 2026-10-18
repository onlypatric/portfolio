import { Button } from "../control/button/Button";
import type { UIProps } from "../_types";
import "../theme.css";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type TapGestureProps = UIProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> & {
  activation?: "click" | "pointerup";
  children?: ReactNode;
  debounce?: number;
  onTap?: () => void;
};

export function TapGesture({ activation = "click", children, className, debounce = 250, onTap, ...props }: TapGestureProps) {
  const lastTap = useRef(0);
  const activate = () => {
    const now = Date.now();
    if (now - lastTap.current < debounce) return;
    lastTap.current = now;
    onTap?.();
  };
  return <Button variant="unstyled" data-ui="TapGesture" {...props} type={props.type ?? "button"} onClick={activation === "click" ? activate : undefined} onPointerUp={activation === "pointerup" ? activate : undefined} className={twMerge("rounded bg-[var(--default)] px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-[length:var(--ui-font-size-sm)] font-medium hover:opacity-85 focus-visible:outline-2 focus-visible:outline-[var(--focus)]", className)}>{children}</Button>;
}
