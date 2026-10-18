import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type LabeledContentProps = UIProps & ComponentPropsWithRef<"dl"> & {
  label: ReactNode; layout?: "horizontal" | "vertical"; value: ReactNode;
  classNames?: Partial<Record<"root" | "label" | "value", string>>;
};
export function LabeledContent({ className, classNames = {}, label, layout = "horizontal", value, ...props }: LabeledContentProps) {
  return <dl {...props} data-ui="LabeledContent" data-layout={layout} className={twMerge("ui-labeled-content", classNames.root, className)}>
    <dt className={classNames.label}>{label}</dt><dd className={classNames.value}>{value}</dd>
  </dl>;
}
