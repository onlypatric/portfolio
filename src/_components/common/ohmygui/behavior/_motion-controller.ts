import { finite, motionFrames } from "./_motion-presets";
import type { MotionSettings } from "./_motion-types";

type State = "pending" | "running" | "paused" | "entered" | "exited";
const sampledProperties = ["opacity", "transform", "translate", "scale", "rotate", "clipPath", "height"] as const;
const snapshot = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  return Object.fromEntries(sampledProperties.map(key => [key, style[key]])) as Keyframe;
};
const milliseconds = (value: string, fallback: number) => {
  const number = parseFloat(value);
  return Number.isFinite(number) ? number * (value.trim().endsWith("ms") ? 1 : 1000) : fallback;
};

/** WAAPI provides real pause/resume (including delays), cancellation and exit lifecycle. */
export function createMotionController(host: HTMLDivElement, content: HTMLDivElement, settled: (visible: boolean) => void) {
  let settings: MotionSettings, animation: Animation | undefined, observer: IntersectionObserver | undefined;
  let intersecting = false, played = false, completed = false, focused = false, disposed = false, skipped = false;
  let wasVisible = true, initialized = false, observedRoot: Element | null | undefined;
  let state: State = "pending";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const supports = typeof IntersectionObserver !== "undefined" && typeof content.animate === "function";
  const ancestors = new MutationObserver(() => reconcile());
  for (let element: HTMLElement | null = host; element; element = element.parentElement) {
    ancestors.observe(element, { attributes: true, attributeFilter: ["style", "class", "hidden", "inert", "aria-hidden", "open", "data-motion-state"] });
  }
  const setState = (next: State) => { state = next; host.dataset.motionState = next; };
  const canSee = () => {
    if (!intersecting || document.visibilityState === "hidden") return false;
    for (let element: HTMLElement | null = host; element; element = element.parentElement) {
      if (element !== host && element.matches('[inert], [aria-hidden="true"]')) return false;
      const style = getComputedStyle(element);
      if (element.hidden || style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    }
    return true;
  };
  const clear = () => {
    if (animation) { animation.onfinish = null; animation.cancel(); animation = undefined; }
    content.style.removeProperty("opacity"); content.style.removeProperty("visibility"); content.style.removeProperty("height");
  };
  const finish = (visible: boolean) => {
    clear(); completed = true; played = visible;
    if (!visible) { content.style.opacity = "0"; content.style.visibility = "hidden"; if (settings.effect === "collapse" || settings.unmountOnExit) content.style.height = "0px"; }
    setState(visible ? "entered" : "exited"); settled(visible);
  };
  const prepare = (exiting: boolean, current?: Keyframe) => {
    clear(); completed = false; skipped = false;
    if (!supports || settings.disabled || reduced.matches || finite(settings.duration, 1) === 0 || (exiting && !canSee())) { finish(!exiting); return; }
    const styles = getComputedStyle(host);
    let duration = Math.max(0, finite(settings.duration, milliseconds(styles.getPropertyValue(settings.motionToken === "snappy" ? "--ui-duration-fast" : "--ui-duration-slow"), 350)));
    let easing = settings.easing ?? (settings.motionToken === "spring" ? "cubic-bezier(.2,1.35,.4,1)" : styles.getPropertyValue("--ui-ease").trim() || "ease-out");
    let delay = Math.max(0, finite(settings.delay, 0));
    let frames: Keyframe[];
    if (settings.from !== undefined || settings.to !== undefined) {
      content.className = "ui-motion-content " + (settings.from ?? "opacity-0"); const from = snapshot(content);
      content.className = "ui-motion-content " + (settings.to ?? "opacity-100"); const to = snapshot(content);
      frames = exiting ? [to, from] : [from, to];
    } else frames = motionFrames(settings, exiting, content.scrollHeight, styles.direction === "rtl");
    if (settings.timing) {
      content.style.transition = "opacity " + settings.timing;
      const timing = getComputedStyle(content);
      duration = milliseconds(timing.transitionDuration, duration); delay += milliseconds(timing.transitionDelay, 0); easing = timing.transitionTimingFunction;
      content.style.removeProperty("transition");
    }
    if (!CSS.supports("animation-timing-function", easing)) easing = "ease-out";
    if (duration <= 0) { skipped = true; finish(!exiting); return; }
    if (current) frames[0] = current;
    const iterations = exiting ? 1 : settings.repeat === true ? Infinity : typeof settings.repeat === "number" ? Math.max(1, Math.floor(finite(settings.repeat, 1))) : 1;
    animation = content.animate(frames, { id: "ui-motion-" + settings.effect, duration, delay: exiting ? 0 : delay, easing, iterations, fill: "both" });
    animation.pause(); animation.currentTime = 0;
    animation.onfinish = () => finish(!exiting);
    setState(exiting ? "paused" : "pending");
    reconcile();
  };
  function reconcile() {
    if (disposed || !settings) return;
    if (settings.disabled || reduced.matches || !supports || finite(settings.duration, 1) === 0) {
      if (!completed || (settings.visible !== false) !== (state === "entered")) finish(settings.visible !== false);
      return;
    }
    const visible = canSee();
    if (!visible || focused) {
      if (animation && animation.playState !== "paused") { animation.pause(); setState(played ? "paused" : "pending"); }
      if (!visible && completed && settings.once === false && settings.visible !== false && settings.repeat !== true) played = false;
      return;
    }
    if (settings.visible !== false && completed && !skipped && (!played || settings.repeat === true)) { prepare(false); return; }
    if (animation?.playState === "paused") { animation.play(); played = true; setState("running"); }
  }
  const focusIn = () => {
    focused = true;
    if (settings.visible !== false && settings.repeat !== true && !completed) finish(true);
    else reconcile();
  };
  const focusOut = (event: FocusEvent) => { if (!host.contains(event.relatedTarget as Node | null)) { focused = false; reconcile(); } };
  host.addEventListener("focusin", focusIn); host.addEventListener("focusout", focusOut);
  document.addEventListener("visibilitychange", reconcile); reduced.addEventListener("change", reconcile);
  host.dataset.motionEnhanced = "true";
  return {
    update(next: MotionSettings) {
      const previous = settings;
      const visible = next.visible !== false;
      const current = animation ? snapshot(content) : initialized && visible !== wasVisible ? snapshot(content) : undefined;
      settings = next;
      // A caller-selected exit target is preferred; never leave focus inside inert content.
      if (!visible && ((wasVisible && next.exitFocusRef?.current) || host.contains(document.activeElement))) {
        next.exitFocusRef?.current?.focus();
        if (host.contains(document.activeElement)) (document.activeElement as HTMLElement)?.blur();
      }
      if (supports && (!observer || observedRoot !== (next.root ?? null))) {
        observer?.disconnect(); observedRoot = next.root ?? null;
        observer = new IntersectionObserver(entries => {
          const entry = entries[entries.length - 1];
          intersecting = entry.isIntersecting && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0;
          reconcile();
        }, { root: observedRoot, rootMargin: "0px", threshold: [0, .001] });
        observer.observe(host);
      }
      const changed = !initialized || visible !== wasVisible || (["replayKey", "effect", "exitEffect", "direction", "distance", "scale", "angle", "axis", "duration", "delay", "easing", "repeat", "from", "to", "timing", "motionToken"] as const).some(key => previous?.[key] !== next[key]);
      wasVisible = visible; initialized = true;
      if (changed) { played = false; prepare(!visible, current); }
      else if (previous?.disabled !== next.disabled) { if (next.disabled) finish(visible); else if (visible) { played = false; prepare(false); } }
      else reconcile();
    },
    dispose() {
      disposed = true; ancestors.disconnect(); observer?.disconnect(); clear();
      document.removeEventListener("visibilitychange", reconcile); reduced.removeEventListener("change", reconcile);
      host.removeEventListener("focusin", focusIn); host.removeEventListener("focusout", focusOut);
      delete host.dataset.motionEnhanced; delete host.dataset.motionState;
    },
  };
}
