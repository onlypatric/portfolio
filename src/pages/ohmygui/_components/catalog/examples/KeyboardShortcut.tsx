import { useState } from "react";
import { Button, CodeText, HStack, KeyboardShortcut, Picker, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [count, setCount] = useState(0);
  const [modifier, setModifier] = useState<"alt" | "ctrl" | "meta" | "shift">("shift");
  const [scope, setScope] = useState<"document" | "window">("document");
  return (
    <VStack gap="md" align="start">
      <HStack gap="md" wrap>
        <Picker label="Modifier" value={modifier} onChange={(event) => setModifier(event.currentTarget.value as typeof modifier)} items={["alt", "ctrl", "meta", "shift"].map((value) => ({ value, label: value }))} />
        <Picker label="Listener scope" value={scope} onChange={(event) => setScope(event.currentTarget.value as typeof scope)} items={[{ value: "document", label: "Document" }, { value: "window", label: "Window" }]} />
      </HStack>
      <KeyboardShortcut
        shortcut="j"
        modifiers={[modifier]}
        scope={scope}
        onTrigger={() => setCount((value) => value + 1)}
      >
        <CodeText inline>{modifier[0].toUpperCase() + modifier.slice(1)} + J</CodeText>
      </KeyboardShortcut>
      <Button variant="outline" onClick={() => setCount((value) => value + 1)}>
        Run the same action
      </Button>
      <Text as="p" role="status">
        Triggered {count} times.
      </Text>
    </VStack>
  );
}
