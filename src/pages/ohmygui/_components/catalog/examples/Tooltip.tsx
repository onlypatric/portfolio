import { useState } from "react";
import { Button, HStack, Picker, Text, Toggle, Tooltip, VStack } from "@/ohmygui";

export default function Example() {
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const [delay, setDelay] = useState("250");
  const [material, setMaterial] = useState(false);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Placement" value={placement} onChange={(event) => setPlacement(event.currentTarget.value as typeof placement)} items={[{ value: "top", label: "Top" }, { value: "bottom", label: "Bottom" }]} />
        <Picker label="Show delay" value={delay} onChange={(event) => setDelay(event.currentTarget.value)} items={[{ value: "0", label: "Immediate" }, { value: "250", label: "250 ms" }, { value: "700", label: "700 ms" }]} />
        <Toggle label="Material surface" checked={material} onChange={(event) => setMaterial(event.currentTarget.checked)} />
      </HStack>
      <Tooltip
        content="Search by title or author."
        delay={Number(delay)}
        placement={placement}
        material={material ? { blur: "12px", opacity: 0.92 } : false}
      >
        <Button variant="outline">Focus or hover this button</Button>
      </Tooltip>
      <Text as="p" variant="metadata" color="muted">Escape closes the tooltip; focus and pointer both reveal it.</Text>
    </VStack>
  );
}
