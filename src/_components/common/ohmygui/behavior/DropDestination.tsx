import type { UIProps } from "../_types";
import "../theme.css";
import { useState, type ComponentPropsWithoutRef, type DragEvent, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type DropDestinationProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "onDrop"> & {
  accept?: string[];
  children?: ReactNode;
  onDropEvent?: (event: DragEvent<HTMLDivElement>) => void;
};

export function DropDestination({ accept, children, className, onDropEvent, ...props }: DropDestinationProps) {
  const [active, setActive] = useState(false);
  const accepts = (event: DragEvent<HTMLDivElement>) => !accept?.length || accept.some((type) => event.dataTransfer.types.includes(type));
  return <div data-ui="DropDestination" {...props} onDragEnter={(event) => { if (accepts(event)) { event.preventDefault(); setActive(true); } }} onDragOver={(event) => { if (accepts(event)) event.preventDefault(); }} onDragLeave={() => setActive(false)} onDrop={(event) => { if (accepts(event)) { event.preventDefault(); setActive(false); onDropEvent?.(event); } }} className={twMerge("rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] p-[var(--ui-space-4)]", active && "border-[var(--accent)] bg-[var(--surface-secondary)]", className)}>{children}</div>;
}
