import { ModalSurface, type ModalSurfaceProps } from "./ModalSurface";
export type FullScreenCoverProps = ModalSurfaceProps;
export function FullScreenCover(props: FullScreenCoverProps) {
  return <ModalSurface data-ui="FullScreenCover" size="full" backdropMaterial={false} {...props} />;
}
