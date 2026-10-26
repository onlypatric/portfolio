import type { UIProps } from "../_types";
import "../theme.css";
import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export type CheckboxProps = UIProps & Omit<
  ComponentPropsWithRef<"input">,
  "checked" | "defaultChecked" | "type"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
};

export function Checkbox({ className, indeterminate = false, ref, ...props }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFill = useRef<boolean | undefined>(undefined);
  const ripples = useRef<Animation[]>([]);
  useImperativeHandle(ref, () => inputRef.current!, []);

  const syncRipple = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    const filled = input.checked || input.indeterminate;
    const previous = previousFill.current;
    previousFill.current = filled;
    if (previous === undefined || previous === filled) return;

    // Continue from the visible radius when a toggle interrupts the last ripple.
    const from = ripples.current.some(animation => animation.playState === "running")
      ? getComputedStyle(input, "::before").clipPath
      : `circle(${previous ? "100%" : "0%"} at 50% 50%)`;
    ripples.current.forEach(animation => animation.cancel());
    ripples.current = [];
    if (!input.animate || matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)").matches) return;

    const to = `circle(${filled ? "100%" : "0%"} at 50% 50%)`;
    try {
      for (const pseudoElement of ["::before", "::after"]) ripples.current.push(input.animate(
        [{ clipPath: from, opacity: 1 }, { clipPath: to, opacity: 1 }],
        { pseudoElement, duration: 320, easing: "cubic-bezier(.2, .7, .2, 1)" },
      ));
    } catch { ripples.current.forEach(animation => animation.cancel()); ripples.current = []; }
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  });

  // Also pick up controlled changes; native changes/reset need no React state.
  useLayoutEffect(() => { syncRipple(); });
  useEffect(() => {
    const input = inputRef.current;
    let frame = 0;
    let active = true;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncRipple);
    };
    const form = input?.form;
    const reset = (event: Event) => queueMicrotask(() => { if (active && !event.defaultPrevented) schedule(); });
    const preference = matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)");
    const settle = () => { if (preference.matches) { ripples.current.forEach(animation => animation.cancel()); ripples.current = []; } };
    input?.addEventListener("change", schedule);
    form?.addEventListener("reset", reset);
    preference.addEventListener("change", settle);
    return () => {
      input?.removeEventListener("change", schedule);
      active = false;
      form?.removeEventListener("reset", reset);
      preference.removeEventListener("change", settle);
      cancelAnimationFrame(frame);
      ripples.current.forEach(animation => animation.cancel());
    };
  }, [syncRipple, props.form]);

  return <input data-ui="Checkbox" {...props} ref={inputRef} type="checkbox" className={twMerge("ui-checkbox", className)} />;
}
