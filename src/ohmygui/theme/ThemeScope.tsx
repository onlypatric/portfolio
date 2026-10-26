import type { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps, UIStyle } from "../_types";
import "../theme.css";
import "./design-system.css";

export type ThemePreset = "studio" | "monochrome" | "modern" | "ember" | "orchid";
export type ThemeMode = "inherit" | "light" | "dark";
export type ThemeDensity = "compact" | "comfortable" | "spacious";
export type ThemeTokens = Partial<Record<"accent" | "accentForeground" | "canvas" | "surface" | "foreground" | "muted" | "border" | "fontFamily" | "editorialFontFamily" | "paperSurface" | "paperForeground" | "paperMuted" | "paperAccent" | "contrastSurface" | "contrastForeground" | "contrastMuted" | "contrastAccent" | "radius", string>>;
const tokenNames: Record<keyof ThemeTokens, string> = { accent: "--accent", accentForeground: "--accent-foreground", canvas: "--ui-canvas", surface: "--surface", foreground: "--foreground", muted: "--muted", border: "--border", fontFamily: "--ui-font-family", editorialFontFamily: "--ui-font-editorial", paperSurface: "--ui-paper-surface", paperForeground: "--ui-paper-foreground", paperMuted: "--ui-paper-muted", paperAccent: "--ui-paper-accent", contrastSurface: "--ui-contrast-surface", contrastForeground: "--ui-contrast-foreground", contrastMuted: "--ui-contrast-muted", contrastAccent: "--ui-contrast-accent", radius: "--radius" };
export type ThemeScopeProps = UIProps & ComponentPropsWithRef<"div"> & { preset?: ThemePreset; mode?: ThemeMode; density?: ThemeDensity; tokens?: ThemeTokens };
/** CSS-only scope. Applications own preference persistence and prepaint initialization. */
export function ThemeScope({ preset = "studio", mode = "inherit", density, tokens, className, style, ...props }: ThemeScopeProps) {
  const overrides: UIStyle = {};
  for (const key of Object.keys(tokens ?? {}) as (keyof ThemeTokens)[]) overrides[tokenNames[key] as `--${string}`] = tokens?.[key];
  return <div {...props} data-ui="ThemeScope" data-ui-preset={preset} data-ui-mode={mode} data-theme={mode === "inherit" ? undefined : mode} data-ui-density={density} className={twMerge("ui-theme-scope", className)} style={{ ...overrides, ...style }} />;
}
