import { useState } from "react";
import { Card, Group, Picker, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [multiline, setMultiline] = useState(true);
  const [selectable, setSelectable] = useState(true);
  const [weight, setWeight] = useState<"regular" | "medium" | "semibold" | "bold">("semibold");
  const [color, setColor] = useState("accent");

  return (
    <Card>
      <VStack gap="md" align="stretch">
        <VStack gap="sm" align="stretch">
          <Picker label="Heading weight" value={weight} onChange={(event) => setWeight(event.currentTarget.value as typeof weight)} items={["regular", "medium", "semibold", "bold"].map((value) => ({ value, label: value }))} />
          <Picker label="Heading color" value={color} onChange={(event) => setColor(event.currentTarget.value)} items={["default", "accent", "success", "warning", "danger", "muted"].map((value) => ({ value, label: value }))} />
          <Toggle label="Preserve line breaks" checked={multiline} onChange={(event) => setMultiline(event.currentTarget.checked)} />
          <Toggle label="Allow text selection" checked={selectable} onChange={(event) => setSelectable(event.currentTarget.checked)} />
        </VStack>
        <Text variant="eyebrow" color="muted">YOUR WORKSPACE</Text>
        <Text as="h3" variant="section" weight={weight} color={color}>A clearer voice.</Text>
        <Text as="p" multiline={multiline} selectable={selectable}>
          {"Semantic roles supply the hierarchy.\nHeading level stays your choice."}
        </Text>
        <Text variant="metric" numeric>12,480</Text>
        <Text variant="metadata" color="muted">Contributions this month</Text>
        <Group className="w-[260px]">
          <Text variant="body" truncate={2}>
            A longer project note is clamped to two lines when its container is narrow.
          </Text>
        </Group>
      </VStack>
    </Card>
  );
}
