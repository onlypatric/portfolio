import { Children, Fragment, cloneElement, isValidElement, type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button, type ButtonProps } from "./Button";
import type { UIProps } from "../../_types";
import "../../theme.css";

export type ButtonGroupProps = UIProps & Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Buttons, fragments, or button-compatible components marked with data-ui-button. */
  children?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  orientation?: "horizontal" | "vertical";
  radius?: ButtonProps["radius"];
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
};

export function ButtonGroup({ children, className, disabled = false, fullWidth = false, orientation = "horizontal", radius = "md", size, variant, ...props }: ButtonGroupProps) {
  function buttons(nodes: ReactNode): ReactNode {
    return Children.map(nodes, (child) => {
      if (child == null || typeof child === "boolean") return null;
      if (!isValidElement<ButtonProps & { "data-ui-button"?: string | boolean }>(child)) {
        throw new Error("ButtonGroup accepts only OhMyGUI Buttons or button-compatible components marked with data-ui-button.");
      }
      if (child.type === Fragment) return buttons(child.props.children);
      if (child.type !== Button && (typeof child.type === "string" || child.props["data-ui-button"] === undefined)) {
        throw new Error("ButtonGroup children must be OhMyGUI Buttons or opt in with data-ui-button and forward button props to a native button.");
      }
      return cloneElement(child, {
        className: twMerge(child.props.className, "rounded-none shadow-none", orientation === "horizontal"
          ? "first:rounded-s-[var(--ui-group-radius)] last:rounded-e-[var(--ui-group-radius)]"
          : "first:rounded-t-[var(--ui-group-radius)] last:rounded-b-[var(--ui-group-radius)]"),
        ...(size !== undefined && child.props.size === undefined ? { size } : {}),
        ...(variant !== undefined && child.props.variant === undefined ? { variant } : {}),
        ...(disabled ? { disabled: true } : {}),
      });
    });
  }

  return <div {...props} data-ui="ButtonGroup" role={props.role ?? "group"} aria-disabled={disabled || undefined}
    data-orientation={orientation} data-radius={radius} data-full-width={fullWidth}
    className={twMerge("ui-button-group", className)}>{buttons(children)}</div>;
}
