import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Draggable } from "@/_components/common/ohmygui/behavior/Draggable";
import { DropDestination } from "@/_components/common/ohmygui/behavior/DropDestination";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { Button } from "@/_components/common/ohmygui/control/button/Button";

export default function Example() {
  const [message, setMessage] = useState("");
  return (
    <VStack gap="md">
      <Draggable payload="Water the seedlings" tabIndex={0} style={{ padding: 20, background: "var(--ui-selection)", borderRadius: 12 }}>Water the seedlings</Draggable>
      <DropDestination aria-label="Today's garden plan" accept={["text/plain"]} onDropEvent={(event) => setMessage(event.dataTransfer.getData("text/plain"))}>
      <Text as="p">Today’s garden plan</Text>
      </DropDestination>
      <Button variant="outline" onClick={() => setMessage("Water the seedlings")}>Add task</Button>
      {message && <Text as="p" role="status">Added: {message}</Text>}
      </VStack>
  );
}
