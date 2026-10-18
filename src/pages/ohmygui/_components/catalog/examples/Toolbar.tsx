import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Toolbar } from "@/_components/common/ohmygui/navigation/Toolbar";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [message, setMessage] = useState("");
  return (
    <VStack gap="md">
      <Toolbar label="Field guide actions" overflow={<Button variant="outline" onClick={() => setMessage("8 pages · Updated today")}>Details</Button>}>
      <Button onClick={() => setMessage("Field guide saved.")}>Save</Button>
      <Button variant="outline" onClick={() => setMessage("Draft changes discarded.")}>Discard</Button>
      </Toolbar>
      {message && <Text as="p" role="status">{message}</Text>}
      </VStack>
  );
}
