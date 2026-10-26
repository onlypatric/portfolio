import type { UIStyle } from "./_types";

export type MaterialOptions = {
  /** CSS blur length; never animated. */
  blur?: string;
  /** Translucent fill coverage, clamped to 0–1. */
  opacity?: number;
  /** Opaque base color used for both tint and no-filter fallback. */
  tint?: string;
};
export type Material = boolean | MaterialOptions;
export type MaterialProps = { material?: Material };

/** Variables, not inline filters: CSS owns feature/preferences/forced-color fallbacks. */
export function materialAttributes(material: Material = false, defaults: MaterialOptions = {}) {
  const options = { ...defaults, ...(typeof material === "object" ? material : {}) };
  const opacity = Number.isFinite(options.opacity) ? Math.min(1, Math.max(0, options.opacity!)) : .86;
  return {
    "data-material": material !== false ? "true" : "false",
    style: {
      "--ui-material-blur": options.blur ?? "16px",
      "--ui-material-opacity": `${opacity * 100}%`,
      "--ui-material-tint": options.tint ?? "var(--surface)",
    } as UIStyle,
  };
}
