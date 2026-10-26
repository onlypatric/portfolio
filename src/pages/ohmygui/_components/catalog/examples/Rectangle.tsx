import { useState } from "react";
import { HStack, Picker, Rectangle, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [size, setSize] = useState("regular");
  const [outline, setOutline] = useState(true);
  const dimensions = size === "compact" ? { width: 160, height: 96 } : size === "wide" ? { width: 280, height: 120 } : { width: 220, height: 120 };

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Size" value={size} onChange={(event) => setSize(event.currentTarget.value)} items={[{ value: "compact", label: "Compact" }, { value: "regular", label: "Regular" }, { value: "wide", label: "Wide" }]} />
        <Toggle label="Outline" checked={outline} onChange={(event) => setOutline(event.currentTarget.checked)} />
      </HStack>
      <Rectangle
        aria-label={`${size} accent-colored rectangle${outline ? " with outline" : ""}`}
        {...dimensions}
        fill="var(--accent)"
        stroke={outline ? "var(--foreground)" : undefined}
        strokeWidth={outline ? 4 : undefined}
      />
    </VStack>
  );
}
