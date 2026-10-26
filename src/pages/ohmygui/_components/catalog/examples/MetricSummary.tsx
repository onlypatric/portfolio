import { Badge, MetricSummary } from "@/ohmygui";
import { CheckCircleIcon } from "@phosphor-icons/react";
export default function Example() {
  return (
    <MetricSummary
      label="Tasks completed"
      value="42"
      detail="8 more than last week"
      icon={<CheckCircleIcon />}
      accessory={
        <Badge variant="success" tone="soft">
          +24%
        </Badge>
      }
      tone="paper"
      appearance="outlined"
    />
  );
}
