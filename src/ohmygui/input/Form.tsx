import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export type FormProps = UIProps & ComponentPropsWithRef<"form">;

export function Form({ className, ...props }: FormProps) {
  return <form data-ui="Form" {...props} className={twMerge("grid min-w-0 gap-[var(--ui-space-4)]", className)} />;
}
