import { useState } from "react";
import { Circle, Picker, VStack } from "@/ohmygui";

export default function Example() {
  const [diameter, setDiameter] = useState("140");

  return (
    <VStack gap="md" align="start">
      <Picker label="Diameter" value={diameter} onChange={(event) => setDiameter(event.currentTarget.value)} items={[{ value: "96", label: "96 px" }, { value: "140", label: "140 px" }, { value: "184", label: "184 px" }]} />
      <Circle
        aria-label={`Circle, ${diameter} pixels wide and high`}
        diameter={Number(diameter)}
        fill="var(--accent)"
        stroke="var(--foreground)"
        strokeWidth={4}
      />
    </VStack>
  );
}
