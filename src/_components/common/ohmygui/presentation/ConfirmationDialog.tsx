import { ModalSurface, type ModalSurfaceProps } from "./ModalSurface";
import { Button } from "../control/button/Button";
import type { PresentationAction } from "./_types";
export type ConfirmationDialogProps = Omit<ModalSurfaceProps, "actions"> & { choices: PresentationAction[]; message?: ModalSurfaceProps["description"] };
export function ConfirmationDialog({ choices, message, ...props }: ConfirmationDialogProps) {
  const firstSafe = choices.findIndex((choice) => !choice.destructive && !choice.disabled);
  return <ModalSurface data-ui="ConfirmationDialog" description={message} {...props} actions={choices.map((choice, index) => <Button key={index} autoFocus={index === firstSafe} disabled={choice.disabled} onClick={choice.onSelect} variant={choice.destructive ? "danger" : "secondary"}>{choice.label}</Button>)} />;
}
