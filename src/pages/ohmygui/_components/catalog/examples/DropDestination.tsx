import { useState } from "react";
import { Button, Card, Draggable, DropDestination, HStack, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [filterText, setFilterText] = useState(true);
  const [message, setMessage] = useState("");

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Toggle label="Accept only text/plain" checked={filterText} onChange={(event) => setFilterText(event.currentTarget.checked)} />
        <Draggable payload="Water the seedlings" tabIndex={0}>
          <Card><Text>Drag this garden task</Text></Card>
        </Draggable>
      </HStack>
      <DropDestination
        aria-label="Today's garden plan drop area"
        accept={filterText ? ["text/plain"] : undefined}
        onDropEvent={(event) => setMessage(`Added: ${event.dataTransfer.getData("text/plain") || "Dropped item"}`)}
      >
        <Text as="p">Drop the task into today’s garden plan.</Text>
        <Text as="p" variant="metadata" color="muted">{filterText ? "This zone accepts text/plain only." : "No type filter is applied."}</Text>
      </DropDestination>
      <Button variant="outline" onClick={() => setMessage("Added: Water the seedlings (keyboard fallback)")}>Add task without dragging</Button>
      {message && <Text as="p" role="status" aria-live="polite">{message}</Text>}
    </VStack>
  );
}
