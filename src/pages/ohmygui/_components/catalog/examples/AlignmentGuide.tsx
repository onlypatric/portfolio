import { useState } from "react";
import { AlignmentGuide, Badge, HStack, Picker, VStack } from "@/ohmygui";

const alignments = ["start", "center", "end", "stretch", "baseline"] as const;

export default function Example() {
  const [align, setAlign] = useState<(typeof alignments)[number]>("end");
  const [offsetMode, setOffsetMode] = useState<"none" | "block" | "inline">("block");
  const offset = offsetMode === "block" ? { block: 8, inline: 0 } : offsetMode === "inline" ? { block: 0, inline: 8 } : undefined;

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Cross-axis alignment" value={align} onChange={(event) => setAlign(event.currentTarget.value as typeof align)} items={alignments.map((value) => ({ value, label: value }))} />
        <Picker label="Offset" value={offsetMode} onChange={(event) => setOffsetMode(event.currentTarget.value as typeof offsetMode)} items={[{ value: "none", label: "None" }, { value: "block", label: "Block · 8 px" }, { value: "inline", label: "Inline · 8 px" }]} />
      </HStack>
      <HStack align="center" gap="lg">
        <Badge>Shared row</Badge>
        <AlignmentGuide align={align} offset={offset}>
          <Badge variant="accent">{align} · {offsetMode}</Badge>
        </AlignmentGuide>
      </HStack>
    </VStack>
  );
}
