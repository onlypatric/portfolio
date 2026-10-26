import { useState } from "react";
import { HStack, Picker, RoundedRectangle, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [radius, setRadius] = useState("28");
  const [outline, setOutline] = useState(true);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Corner radius" value={radius} onChange={(event) => setRadius(event.currentTarget.value)} items={[{ value: "8", label: "8 px" }, { value: "28", label: "28 px" }, { value: "52", label: "52 px" }]} />
        <Toggle label="Outline" checked={outline} onChange={(event) => setOutline(event.currentTarget.checked)} />
      </HStack>
      <RoundedRectangle
        aria-label={`Rounded rectangle with ${radius}px corners${outline ? " and outline" : ""}`}
        width={220}
        height={120}
        radius={Number(radius)}
        fill="var(--accent)"
        stroke={outline ? "var(--foreground)" : undefined}
        strokeWidth={outline ? 4 : undefined}
      />
    </VStack>
  );
}
