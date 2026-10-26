import { useState } from "react";
import { Group, LinearGradient, Picker, Surface, VStack } from "@/ohmygui";

export default function Example() {
  const [direction, setDirection] = useState("135deg");

  return (
    <VStack gap="md" align="stretch">
      <Picker label="Direction" value={direction} onChange={(event) => setDirection(event.currentTarget.value)} items={[{ value: "to right", label: "Left to right" }, { value: "to bottom", label: "Top to bottom" }, { value: "135deg", label: "135° diagonal" }, { value: "to top left", label: "Toward top left" }]} />
      <Group className="h-[180px] w-full">
        <Surface padding="none" radius="lg" className="h-full overflow-hidden">
          <LinearGradient
            aria-label={`Linear gradient directed ${direction}`}
            role="img"
            colors={["var(--accent)", "var(--ui-selection)", "var(--success)"]}
            direction={direction}
            className="h-full w-full"
          />
        </Surface>
      </Group>
    </VStack>
  );
}
