import { useState } from "react";
import { Button, HStack, Picker, TapGesture, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [count, setCount] = useState(0);
  const [activation, setActivation] = useState<"click" | "pointerup">("click");
  const [debounce, setDebounce] = useState("300");
  const recordTap = () => setCount((value) => value + 1);
  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Activation" value={activation} onChange={(event) => setActivation(event.currentTarget.value as typeof activation)} items={[{ value: "click", label: "Click" }, { value: "pointerup", label: "Pointer up" }]} />
        <Picker label="Debounce" value={debounce} onChange={(event) => setDebounce(event.currentTarget.value)} items={[{ value: "0", label: "Off" }, { value: "300", label: "300 ms" }, { value: "700", label: "700 ms" }]} />
      </HStack>
      <HStack gap="sm" align="center" wrap>
        <TapGesture activation={activation} debounce={Number(debounce)} tabIndex={activation === "pointerup" ? -1 : undefined} onTap={recordTap}>
          {activation === "click" ? "Tap or press Enter / Space" : "Tap with a pointer"}
        </TapGesture>
        {activation === "pointerup" && <Button variant="outline" onClick={recordTap}>Keyboard alternative</Button>}
      </HStack>
      <Text as="p" role="status" aria-live="polite">
        Accepted {count} taps. {activation === "click" ? "Click mode supports keyboard." : "Pointer-up mode uses the keyboard alternative."} Repeats inside {debounce} ms are ignored.
      </Text>
    </VStack>
  );
}
