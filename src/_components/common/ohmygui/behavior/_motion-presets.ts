import type { MotionEffect, MotionSettings } from "./_motion-types";

export const finite = (value: number | undefined, fallback: number) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
export const motionEffect = (name: string | undefined): MotionEffect => {
  const value = name?.replace(/-(?:in|out)$/, "");
  return ["fade", "slide", "scale", "rotate", "flip", "reveal", "collapse", "bounce", "shake", "pulse", "float"].includes(value ?? "") ? value as MotionEffect : "fade";
};

/** Pure preset construction; root geometry stays untransformed for visibility detection. */
export function motionFrames(settings: MotionSettings, exiting: boolean, height: number, rtl: boolean): Keyframe[] {
  const effect = exiting ? settings.exitEffect ?? settings.effect : settings.effect;
  let direction = settings.direction ?? "up";
  if (direction === "start") direction = rtl ? "right" : "left";
  if (direction === "end") direction = rtl ? "left" : "right";
  const distance = Math.abs(finite(settings.distance, effect === "float" ? 8 : effect === "bounce" ? 14 : effect === "shake" ? 8 : 24));
  const scale = Math.max(.01, finite(settings.scale, effect === "pulse" ? 1.04 : .92));
  let start: Keyframe = { opacity: 0 }, end: Keyframe = { opacity: 1 };
  switch (effect) {
    case "slide": start.transform = `translate${direction === "left" || direction === "right" ? "X" : "Y"}(${direction === "left" || direction === "up" ? -distance : distance}px)`; end.transform = "translate(0px, 0px)"; break;
    case "scale": start.transform = `scale(${scale})`; end.transform = "scale(1)"; break;
    case "rotate": start.transform = `rotate(${finite(settings.angle, -8)}deg)`; end.transform = "rotate(0deg)"; break;
    case "flip": start.transform = `perspective(800px) rotate${settings.axis === "x" ? "X" : "Y"}(${finite(settings.angle, 75)}deg)`; end.transform = `perspective(800px) rotate${settings.axis === "x" ? "X" : "Y"}(0deg)`; break;
    case "reveal": start.clipPath = direction === "left" ? "inset(0 100% 0 0)" : direction === "right" ? "inset(0 0 0 100%)" : direction === "down" ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)"; end.clipPath = "inset(0 0 0 0)"; break;
    case "collapse": start.height = "0px"; end.height = `${Math.max(0, height)}px`; break;
    case "bounce": if (!exiting) return [0, -distance, 0, -distance * .4, 0].map(y => ({ transform: `translateY(${y}px)` })); break;
    case "shake": if (!exiting) return [0, -distance, distance, -distance * .65, distance * .65, -distance * .3, distance * .3, 0].map(x => ({ transform: `translateX(${x}px)` })); break;
    case "pulse": if (!exiting) return [{ transform: "scale(1)", opacity: 1 }, { transform: `scale(${scale})`, opacity: .85 }, { transform: "scale(1)", opacity: 1 }]; break;
    case "float": if (!exiting) return [{ transform: "translateY(0px)" }, { transform: `translateY(${-distance}px)` }, { transform: "translateY(0px)" }]; break;
  }
  return exiting ? [end, start] : [start, end];
}
