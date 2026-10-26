import type { ReactNode } from "react";

export type PresentationAction = {
  destructive?: boolean;
  disabled?: boolean;
  label: ReactNode;
  onSelect?: () => void;
};

export type PresentationCommand = {
  id: string;
  keywords?: string[];
  label: string;
  onSelect?: () => void;
};

export type PresentationMenuItem = PresentationAction & {
  id?: string;
  shortcut?: string;
  href?: string;
};
