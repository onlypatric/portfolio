import type { UIProps } from "../_types";
import "../theme.css";
import * as PhosphorIcons from "@phosphor-icons/react";
import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
  IconWeight,
} from "@phosphor-icons/react";

export type IconProps = UIProps & Omit<
  PhosphorIconProps,
  "aria-label" | "size" | "weight"
> & {
  label?: string;
  mirrored?: boolean;
  name: string;
  size?: number | string;
  stroke?: IconWeight;
};

function toExportName(name: string) {
  return name
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function resolveIcon(name: string): PhosphorIcon | undefined {
  const exportName = toExportName(name);
  const registry = PhosphorIcons as unknown as Record<string, PhosphorIcon>;
  return registry[exportName] ?? registry[`${exportName}Icon`];
}

export function Icon({
  label,
  mirrored = false,
  name,
  size = "1em",
  stroke = "regular",
  ...props
}: IconProps) {
  const IconComponent = resolveIcon(name) ?? PhosphorIcons.Question;

  return (
    <IconComponent data-ui="Icon"
      {...props}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      mirrored={mirrored}
      role={label ? "img" : undefined}
      size={size}
      weight={stroke}
    />
  );
}
