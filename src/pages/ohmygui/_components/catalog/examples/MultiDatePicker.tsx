import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { MultiDatePicker } from "@/_components/common/ohmygui/input/MultiDatePicker";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["2026-10-17"]);
  return (
    <VStack gap="md">
      <MultiDatePicker label="Studio days" name="studioDays" initialMonth="2026-10" min="2026-09-01" max="2027-02-28" selected={selected} onSelectedChange={setSelected} />
      <Text as="p" role="status">{selected.length} dates selected.</Text>
      </VStack>
  );
}
