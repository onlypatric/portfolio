import type { ReactNode } from "react";

export type BehaviorAction = {
  label: ReactNode;
  onSelect?: () => void;
  tone?: "danger" | "default";
};

export type DragDelta = {
  x: number;
  y: number;
};
