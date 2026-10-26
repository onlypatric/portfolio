import { useState } from "react";
import { Group, HStack, Picker, ScrollIndicators, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [gutter, setGutter] = useState<"always" | "auto">("always");
  const [visible, setVisible] = useState(true);
  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Scrollbar gutter" value={gutter} onChange={(event) => setGutter(event.currentTarget.value as typeof gutter)} items={[{ value: "auto", label: "Automatic" }, { value: "always", label: "Stable space" }]} />
        <Toggle label="Use full-width scrollbars" checked={visible} onChange={(event) => setVisible(event.currentTarget.checked)} />
      </HStack>
      <Group className="h-[180px]">
        <ScrollIndicators gutter={gutter} visible={visible} className="h-full" tabIndex={0} aria-label="Scrollable notes">
          <VStack gap="md">{["Draft created", "Cover approved", "Proof sent", "Print run confirmed", "Tracking added", "Review scheduled", "Index updated", "Ready to publish"].map((item) => <Text as="p" key={item}>{item}</Text>)}</VStack>
        </ScrollIndicators>
      </Group>
    </VStack>
  );
}
