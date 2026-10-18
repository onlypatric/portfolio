import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, type ComponentPropsWithoutRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

export type KeyboardShortcutProps = UIProps & ComponentPropsWithoutRef<"span"> & {
  children?: ReactNode;
  modifiers?: Array<"alt" | "ctrl" | "meta" | "shift">;
  onTrigger?: () => void;
  scope?: "document" | "window";
  shortcut: string;
};

export function KeyboardShortcut({ children, modifiers = [], onTrigger, scope = "document", shortcut: shortcutKey, ...props }: KeyboardShortcutProps) {
  useEffect(() => {
    const target = scope === "window" ? window : document;
    const handler = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement | null;
      if (element?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key.toLowerCase() !== shortcutKey.toLowerCase()) return;
      if (modifiers.includes("alt") !== event.altKey || modifiers.includes("ctrl") !== event.ctrlKey || modifiers.includes("meta") !== event.metaKey || modifiers.includes("shift") !== event.shiftKey) return;
      event.preventDefault();
      onTrigger?.();
    };
    target.addEventListener("keydown", handler as EventListener);
    return () => target.removeEventListener("keydown", handler as EventListener);
  }, [modifiers, onTrigger, scope, shortcutKey]);
  return <span data-ui="KeyboardShortcut" {...props} data-shortcut={shortcutKey}>{children}</span>;
}
