import { ModalSurface, type ModalSurfaceProps } from "./ModalSurface";
export type SheetProps = Omit<ModalSurfaceProps, "placement"> & { placement?: "bottom" | "end" };
export function Sheet({ placement = "bottom", ...props }: SheetProps) {
  return <ModalSurface data-ui="Sheet" placement={placement} {...props} />;
}
