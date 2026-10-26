import { useState } from "react";
import { SegmentedPicker, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [value, setValue] = useState("comfortable");
  return (
    <VStack gap="md">
      <SegmentedPicker
        name="density"
        label="Display density"
        helperText="Choose a density for this view."
        required
        choices={[
          { value: "compact", label: "Compact" },
          { value: "comfortable", label: "Comfortable" },
          { value: "spacious", label: "Spacious · unavailable", disabled: true },
        ]}
        value={value}
        onChange={setValue}
      />
      <Text as="p" role="status">
        Density: {value}
      </Text>
    </VStack>
  );
}
