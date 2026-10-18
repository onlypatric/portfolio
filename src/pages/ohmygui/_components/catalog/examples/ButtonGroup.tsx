import { useState } from "react";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { ButtonGroup } from "@/_components/common/ohmygui/control/button/ButtonGroup";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [count, setCount] = useState(0);
  return <VStack gap="md" align="start">
    <ButtonGroup aria-label="Adjust quantity" variant="secondary" radius="full">
      <Button onClick={() => setCount(value => value - 1)}>Decrease</Button>
      <Button onClick={() => setCount(0)}>Reset</Button>
      <Button onClick={() => setCount(value => value + 1)}>Increase</Button>
    </ButtonGroup>
    <Text as="p" role="status">Quantity: {count}</Text>
    <ButtonGroup aria-label="Unavailable actions" orientation="vertical" variant="outline" size="sm" disabled>
      <Button>Archive</Button>
      <Button>Delete</Button>
    </ButtonGroup>
  </VStack>;
}
