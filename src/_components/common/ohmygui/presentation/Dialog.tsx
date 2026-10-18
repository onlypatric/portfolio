import { ModalSurface, type ModalSurfaceProps } from "./ModalSurface";
export type DialogProps = ModalSurfaceProps;
export function Dialog(props: DialogProps) {
  return <ModalSurface data-ui="Dialog" {...props} />;
}
