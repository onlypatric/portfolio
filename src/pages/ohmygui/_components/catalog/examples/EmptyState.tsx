import { useState } from "react";
import { NotebookIcon } from "@phosphor-icons/react";
import { Button, EmptyState, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [created, setCreated] = useState(false);
  return (
    <VStack gap="md">
      {created ? (
        <Text as="p" role="status">
          Your first note is ready.
        </Text>
      ) : (
        <EmptyState
          title="No field notes yet"
          description="Record observations from the garden."
          action={<Button onClick={() => setCreated(true)}>Add a note</Button>}
        >
          <NotebookIcon size={32} aria-hidden="true" />
        </EmptyState>
      )}
    </VStack>
  );
}
