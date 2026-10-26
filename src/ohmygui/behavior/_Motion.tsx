import { useLayoutEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { MotionProps, MotionSettings } from "./_motion-types";
import { createMotionController } from "./_motion-controller";
import "../theme.css";
import "./motion.css";

export type MotionViewProps = MotionProps & Omit<MotionSettings, keyof MotionProps> & { name: string };

export function MotionView({
  children, className, name, effect, exitEffect, direction, distance, scale, angle, axis, motionToken,
  visible = true, duration, delay, easing, once = true, repeat = false, replayKey, disabled = false, root,
  unmountOnExit = false, exitFocusRef, onEnterComplete, onExitComplete, from, to, timing, ref, ...props
}: MotionViewProps) {
  const host = useRef<HTMLDivElement | null>(null), content = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof createMotionController> | null>(null);
  const [present, setPresent] = useState(visible);
  const callbacks = useRef({ onEnterComplete, onExitComplete }); callbacks.current = { onEnterComplete, onExitComplete };
  useLayoutEffect(() => {
    if (!host.current || !content.current) return;
    controller.current = createMotionController(host.current, content.current, shown => {
      setPresent(shown);
      if (shown) callbacks.current.onEnterComplete?.(); else callbacks.current.onExitComplete?.();
    });
    return () => { controller.current?.dispose(); controller.current = null; };
  }, []);
  useLayoutEffect(() => {
    if (visible) setPresent(true);
    controller.current?.update({ effect, exitEffect, direction, distance, scale, angle, axis, motionToken, visible, duration, delay, easing, once, repeat, replayKey, disabled, root, unmountOnExit, exitFocusRef, from, to, timing });
  }, [effect, exitEffect, direction, distance, scale, angle, axis, motionToken, visible, duration, delay, easing, once, repeat, replayKey, disabled, root, unmountOnExit, exitFocusRef, from, to, timing]);

  return <div {...props} ref={element => {
    host.current = element;
    if (typeof ref === "function") return ref(element);
    if (ref) ref.current = element;
  }} data-ui={name} data-motion-effect={effect} data-motion-visible={visible} data-motion-unmount={unmountOnExit || undefined}
    data-state={visible ? "enter" : "exit"} inert={!visible || props.inert || undefined} aria-hidden={!visible || props["aria-hidden"] || undefined}
    className={twMerge("ui-motion", className)}>
    <div ref={content} data-slot="motion" className={twMerge("ui-motion-content", to)}>{(visible || present || !unmountOnExit) && children}</div>
  </div>;
}
