import { useState } from "react";
import { HStack, Picker, Shadow, Surface, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [level, setLevel] = useState<"sm" | "md" | "lg" | "xl" | "2xl">("lg");
  const [tinted, setTinted] = useState(true);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Shadow level" value={level} onChange={(event) => setLevel(event.currentTarget.value as typeof level)} items={["sm", "md", "lg", "xl", "2xl"].map((value) => ({ value, label: value }))} />
        <Toggle label="Accent tint" checked={tinted} onChange={(event) => setTinted(event.currentTarget.checked)} />
      </HStack>
      <Shadow level={level} color={tinted ? "var(--accent)" : undefined}>
        <Surface appearance="outlined" tone="paper" padding="lg">
          <Text as="p" weight="semibold">A little elevation.</Text>
        </Surface>
      </Shadow>
    </VStack>
  );
}
