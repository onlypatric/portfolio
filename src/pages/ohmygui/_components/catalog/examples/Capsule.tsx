import { useState } from "react";
import { Capsule, HStack, Picker, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [width, setWidth] = useState("220");
  const [outline, setOutline] = useState(true);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Width" value={width} onChange={(event) => setWidth(event.currentTarget.value)} items={[{ value: "160", label: "Compact" }, { value: "220", label: "Regular" }, { value: "280", label: "Wide" }]} />
        <Toggle label="Outline" checked={outline} onChange={(event) => setOutline(event.currentTarget.checked)} />
      </HStack>
      <Capsule
        aria-label={`${width}px accent-colored capsule${outline ? " with outline" : ""}`}
        width={Number(width)}
        height={80}
        fill="var(--accent)"
        stroke={outline ? "var(--foreground)" : undefined}
        strokeWidth={outline ? 4 : undefined}
      />
    </VStack>
  );
}
