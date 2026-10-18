import { useState } from "react";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { ControlGroup } from "@/_components/common/ohmygui/input/ControlGroup";
import { HelpLink } from "@/_components/common/ohmygui/input/HelpLink";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [message, setMessage] = useState("");
  return (
    <VStack gap="md">
      <ControlGroup label="Field guide actions">
      <Button variant="outline" onClick={() => setMessage("Copy created: Field guide (1).")}>Duplicate</Button>
      <Button variant="outline" onClick={() => setMessage("Field guide archived.")}>Archive</Button>
      <HelpLink href="/ohmygui">About this library</HelpLink>
      </ControlGroup>
      {message && <Text as="p" role="status">{message}</Text>}
    </VStack>
  );
}
