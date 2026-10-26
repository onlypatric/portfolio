import { useState } from "react";
import { Badge, Group, HStack, Picker, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [align, setAlign] = useState<"start" | "center" | "end" | "stretch">("start");
  const [justify, setJustify] = useState<"start" | "center" | "between">("start");
  const [gap, setGap] = useState<"sm" | "md" | "lg">("md");

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Cross-axis alignment" value={align} onChange={(event) => setAlign(event.currentTarget.value as typeof align)} items={[{ value: "start", label: "Start" }, { value: "center", label: "Center" }, { value: "end", label: "End" }, { value: "stretch", label: "Stretch" }]} />
        <Picker label="Vertical distribution" value={justify} onChange={(event) => setJustify(event.currentTarget.value as typeof justify)} items={[{ value: "start", label: "Start" }, { value: "center", label: "Center" }, { value: "between", label: "Space between" }]} />
        <Picker label="Gap" value={gap} onChange={(event) => setGap(event.currentTarget.value as typeof gap)} items={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} />
      </HStack>
      <Group className="h-[220px]">
        <VStack as="section" aria-label="Project summary" gap={gap} align={align} justify={justify} style={{ height: "100%" }}>
          <Badge tone="soft">PROJECT 04</Badge>
          <Text variant="title" weight="semibold">Spring field guide</Text>
          <Text color="muted">Draft · Updated today</Text>
        </VStack>
      </Group>
    </VStack>
  );
}
