import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { KeyboardShortcut } from "@/_components/common/ohmygui/behavior/KeyboardShortcut";
import { CodeText } from "@/_components/common/ohmygui/content/CodeText";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { Button } from "@/_components/common/ohmygui/control/button/Button";

export default function Example() {
  const [count, setCount] = useState(0);
  return (
    <VStack gap="md">
      <KeyboardShortcut shortcut="j" modifiers={["alt"]} onTrigger={() => setCount((value) => value + 1)}>
      <CodeText inline>Alt + J</CodeText>
      </KeyboardShortcut>
      <Button variant="outline" onClick={() => setCount((value) => value + 1)}>Run the same action</Button>
      <Text as="p" role="status">Triggered {count} times.</Text>
      </VStack>
  );
}
