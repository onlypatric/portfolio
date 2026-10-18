import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Toggle } from "@/_components/common/ohmygui/input/Toggle";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [enabled, setEnabled] = useState(false);
  return (
    <VStack gap="md">
      <Toggle label="Release alerts" description="Urgent updates only." name="alerts" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
      <Text as="p" role="status">{enabled ? "Alerts on." : "Alerts off."}</Text>
      </VStack>
  );
}
