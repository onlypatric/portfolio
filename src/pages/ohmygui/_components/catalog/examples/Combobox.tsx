import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Combobox } from "@/_components/common/ohmygui/input/Combobox";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [value, setValue] = useState("");
  return (
    <VStack gap="md">
      <Combobox label="Workspace" name="workspace" helperText="Type or use arrows · Enter selects" placeholder="Find a workspace…" options={[{ value: "studio", label: "Studio" }, { value: "library", label: "Library" }, { value: "garden", label: "Garden" }, { value: "archive", label: "Archive · unavailable", disabled: true }]} value={value} onValueChange={setValue} />
      <Text as="p" role="status">Value: {value || "Nothing selected"}</Text>
      </VStack>
  );
}
