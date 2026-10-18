import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { RadioGroup } from "@/_components/common/ohmygui/input/RadioGroup";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [value, setValue] = useState("weekly");
  return (
    <VStack gap="md">
      <RadioGroup name="delivery" legend="Update frequency" items={[{ value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" }, { value: "daily", label: "Daily — unavailable", disabled: true }]} value={value} onChange={setValue} />
      <Text as="p" role="status">Selected: {value}</Text>
      </VStack>
  );
}
