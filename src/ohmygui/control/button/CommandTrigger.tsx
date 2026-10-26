import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button, type ButtonProps } from "./Button";
import "../../theme/design-system.css";
export type CommandTriggerProps = Omit<ButtonProps, "children"> & { label: string; icon?: ReactNode; shortcut?: string };
/** A search affordance; command behavior remains with the owning CommandPalette. */
export function CommandTrigger({ label, icon, shortcut, className, ...props }: CommandTriggerProps) {
  return <Button variant="outline" {...props} className={twMerge("ui-command-trigger", className)} aria-label={props["aria-label"] ?? label}>
    {icon}<span data-slot="title">{label}</span>{shortcut && <span data-slot="shortcut">{shortcut}</span>}
  </Button>;
}
