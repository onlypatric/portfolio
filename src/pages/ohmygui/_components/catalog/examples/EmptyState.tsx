import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { EmptyState } from "@/_components/common/ohmygui/collection/EmptyState";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [created, setCreated] = useState(false);
  return (
    <VStack gap="md">
      {created ? <Text as="p" role="status">Your first note is ready.</Text> : <EmptyState title="No field notes yet" description="Record observations from the garden." action={<Button onClick={() => setCreated(true)}>Add a note</Button>} />}</VStack>
  );
}
