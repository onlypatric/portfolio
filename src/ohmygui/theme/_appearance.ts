import type { UIStyle } from "../_types";
import { spacingValue, type LayoutSpacing } from "../layout/_types";
export type SurfaceAppearance = "plain" | "outlined" | "soft" | "elevated" | "solid";
export type SurfaceTone = "neutral" | "accent" | "success" | "warning" | "danger" | "contrast" | "paper";
export type SurfaceRadius = "none" | "sm" | "md" | "lg" | "full";
export type SurfaceOptions = { appearance?: SurfaceAppearance; tone?: SurfaceTone; padding?: LayoutSpacing; radius?: SurfaceRadius };
export function surfaceAttributes({ appearance = "outlined", tone = "neutral", padding = "md", radius = "lg" }: SurfaceOptions) {
  return { "data-appearance": appearance, "data-tone": tone, "data-radius": radius, style: { "--ui-surface-padding": spacingValue(padding) } as UIStyle };
}
