import { useState } from "react";
import { AngularGradient, Group, Picker, Surface, VStack } from "@/ohmygui";

export default function Example() {
  const [angle, setAngle] = useState("-45");

  return (
    <VStack gap="md" align="stretch">
      <Picker label="Start angle" value={angle} onChange={(event) => setAngle(event.currentTarget.value)} items={[{ value: "-90", label: "−90°" }, { value: "-45", label: "−45°" }, { value: "0", label: "0°" }, { value: "45", label: "45°" }]} />
      <Group className="h-[180px] w-full">
        <Surface padding="none" radius="lg" className="h-full overflow-hidden">
          <AngularGradient
            aria-label={`Angular gradient starting at ${angle} degrees`}
            role="img"
            colors={["var(--accent)", "var(--success)", "var(--warning)", "var(--accent)"]}
            fromAngle={Number(angle)}
            className="h-full w-full"
          />
        </Surface>
      </Group>
    </VStack>
  );
}
