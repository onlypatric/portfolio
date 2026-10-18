import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { SegmentedPicker } from "@/_components/common/ohmygui/input/SegmentedPicker";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [value, setValue] = useState("comfortable");
  return (
    <VStack gap="md">
      <SegmentedPicker name="density" label="Display density" choices={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }, { value: "spacious", label: "Spacious" }]} value={value} onChange={setValue} />
      <Text as="p" role="status">Density: {value}</Text>
      </VStack>
  );
}
