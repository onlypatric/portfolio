import type { ReactNode } from "react";

/** Text for native options/typeahead; custom labels can supply InputOption.textValue. */
export function optionText(label: ReactNode): string {
  if (typeof label === "string" || typeof label === "number") return String(label);
  if (Array.isArray(label)) return label.map(optionText).join(" ");
  if (label && typeof label === "object" && "props" in label) return optionText((label.props as { children?: ReactNode }).children);
  return "";
}
