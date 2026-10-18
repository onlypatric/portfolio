import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Checkbox } from "@/_components/common/ohmygui/input/Checkbox";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [checked, setChecked] = useState(true);
  return (
    <VStack gap="md">
      <label style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} />Send me thoughtful updates</label>
      <Text as="p" role="status">{checked ? "Updates enabled." : "Updates disabled."}</Text>
      </VStack>
  );
}
