import { useState } from "react";
import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  return (
    <VStack gap="md" align="start">
      <HStack gap="sm" wrap>
      <Button onClick={() => setCount((value) => value + 1)}>Add a little</Button>
      <Button variant="outline" onClick={() => setCount(0)}>Reset</Button>
      <Button disabled>Unavailable</Button>
      <Button variant="secondary" longPress={650} onPress={() => setCount(value => value + 1)}>Hold to add</Button>
      <Button variant="outline" onPress={async () => { setMessage("Saving draft…"); await new Promise(resolve => setTimeout(resolve, 450)); setMessage("Draft saved."); }}>Save draft</Button>
      <Button variant="ghost" onPress={() => Promise.reject(new Error("Save failed"))} onPressError={() => setMessage("Save failed. Try again.")}>Simulate save failure</Button>
      </HStack>
      <Text as="p" role="status">Pressed {count} times.</Text>
      {message && <Text as="p" color="muted" role="status">{message}</Text>}
      </VStack>
  );
}
