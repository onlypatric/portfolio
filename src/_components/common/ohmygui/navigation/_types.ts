import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type NavigationItem = {
  icon?: ReactNode;
  selectedIcon?: ReactNode;
  badge?: ReactNode;
  current?: boolean;
  disabled?: boolean;
  href?: string;
  id?: string;
  label: ReactNode;
};

export type NavigationTab = {
  icon?: ReactNode;
  selectedIcon?: ReactNode;
  badge?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  id: string;
  label: ReactNode;
};

export type NavigationAction = {
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  onSelect?: () => void;
  shortcut?: string;
};

export type NavigationElementProps = ComponentPropsWithoutRef<"div">;
