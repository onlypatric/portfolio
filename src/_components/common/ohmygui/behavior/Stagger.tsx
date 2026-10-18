import { Children } from "react";
import { twMerge } from "tailwind-merge";
import { MotionView } from "./_Motion";
import { finite } from "./_motion-presets";
import type { MotionEffect, MotionProps } from "./_motion-types";

export type StaggerProps = MotionProps & { effect?: MotionEffect; stagger?: number; maxDelay?: number };
export function Stagger({ children, className, effect = "slide", stagger = 70, maxDelay = 500, visible, duration, delay, easing, once, repeat, replayKey, disabled, root, unmountOnExit, exitFocusRef, onEnterComplete, onExitComplete, ...props }: StaggerProps) {
  return <div {...props} data-ui="Stagger" className={twMerge("grid gap-[var(--ui-space-3)]", className)}>
    {Children.toArray(children).map((child, index) => <MotionView key={typeof child === "object" && "key" in child ? child.key ?? index : index}
      name="StaggerItem" effect={effect} visible={visible} duration={duration} easing={easing} once={once} repeat={repeat} replayKey={replayKey} disabled={disabled} root={root} unmountOnExit={unmountOnExit} exitFocusRef={exitFocusRef} onEnterComplete={onEnterComplete} onExitComplete={onExitComplete}
      delay={Math.max(0, finite(delay, 0)) + Math.min(Math.max(0, finite(maxDelay, 500)), index * Math.max(0, finite(stagger, 70)))}>{child}</MotionView>)}
  </div>;
}
