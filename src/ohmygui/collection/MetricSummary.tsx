import type { ReactNode } from "react";
import { Card, type CardProps } from "./Card";
import { Text } from "../content/Text";
import { HStack } from "../layout/HStack";
import { VStack } from "../layout/VStack";
import { Surface } from "../drawing/Surface";
export type MetricSummaryProps = Omit<CardProps, "children"> & { label: ReactNode; value: ReactNode; detail?: ReactNode; icon?: ReactNode; accessory?: ReactNode };
export function MetricSummary({ label, value, detail, icon, accessory, ...props }: MetricSummaryProps) {
  return <Card {...props} data-ui="MetricSummary"><HStack align="center" justify="between" gap="sm"><Text variant="metadata" color="muted">{label}</Text>{icon != null && <Surface as="span" appearance="soft" tone="accent" padding="xs" radius="sm" aria-hidden="true">{icon}</Surface>}</HStack><HStack align="bottom" justify="between" gap="sm"><VStack gap="sm"><Text variant="metric" numeric>{value}</Text>{detail != null && <Text variant="metadata" color="muted">{detail}</Text>}</VStack>{accessory != null && <span data-slot="accessory">{accessory}</span>}</HStack></Card>;
}
