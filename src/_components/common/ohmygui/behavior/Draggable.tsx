import type { UIProps } from "../_types";
import "../theme.css";
import { type DragEvent, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type DraggableProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "draggable"> & {
  children?: ReactNode;
  effectAllowed?: DataTransfer["effectAllowed"];
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
  payload: string;
};

export function Draggable({ children, className, effectAllowed = "copy", onDragStart, payload, ...props }: DraggableProps) {
  return <div data-ui="Draggable" {...props} draggable onDragStart={(event) => { event.dataTransfer.effectAllowed = effectAllowed; event.dataTransfer.setData("text/plain", payload); onDragStart?.(event); }} className={twMerge("cursor-grab focus-visible:outline-2 focus-visible:outline-[var(--focus)]", className)}>{children}</div>;
}
