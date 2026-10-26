import { useState } from "react";
import { Button, ButtonGroup, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [count, setCount] = useState(0);
  return (
    <VStack gap="md" align="stretch">
      <ButtonGroup
        aria-label="Adjust quantity"
        variant="secondary"
        radius="full"
        fullWidth
      >
        <Button onClick={() => setCount((value) => value - 1)}>Decrease</Button>
        <Button onClick={() => setCount(0)}>Reset</Button>
        <Button onClick={() => setCount((value) => value + 1)}>Increase</Button>
      </ButtonGroup>
      <Text as="p" role="status">
        Quantity: {count}
      </Text>
      <ButtonGroup
        aria-label="Unavailable actions"
        orientation="vertical"
        variant="outline"
        size="sm"
        disabled
      >
        <Button>Archive</Button>
        <Button>Delete</Button>
      </ButtonGroup>
    </VStack>
  );
}
