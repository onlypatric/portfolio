/** Public OhMyGUI entry. Topic and leaf modules remain available for focused imports. */
export * from "./layout";
export * from "./content";
export * from "./input";
export * from "./collection";
export * from "./navigation";
export * from "./presentation";
export * from "./drawing";
export * from "./behavior";
export * from "./theme";
export { ModalSurface } from "./presentation/ModalSurface";
export type { ModalSurfaceProps } from "./presentation/ModalSurface";
export type { UIProps, UIStyle } from "./_types";
export type { Material, MaterialOptions, MaterialProps } from "./_material";
export type { SurfaceAppearance, SurfaceTone, SurfaceRadius, SurfaceOptions } from "./theme/_appearance";
export type { MotionEffect, MotionDirection, MotionOptions, MotionProps } from "./behavior/_motion-types";
export type { PopupAnimationProps } from "./_usePopupMotion";
