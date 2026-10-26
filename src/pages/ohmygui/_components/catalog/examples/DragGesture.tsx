import { useState } from "react";
import { Button, DragGesture, HStack, Picker, Surface, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [axis, setAxis] = useState<"both" | "horizontal" | "vertical">("both");
  const [snap, setSnap] = useState(true);
  const [keyboardStep, setKeyboardStep] = useState("8");
  const [resetKey, setResetKey] = useState(0);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Drag axis" value={axis} onChange={(event) => setAxis(event.currentTarget.value as typeof axis)} items={[{ value: "both", label: "Both axes" }, { value: "horizontal", label: "Horizontal" }, { value: "vertical", label: "Vertical" }]} />
        <Picker label="Keyboard step · snap off" value={keyboardStep} onChange={(event) => setKeyboardStep(event.currentTarget.value)} items={[{ value: "4", label: "4 px" }, { value: "8", label: "8 px" }, { value: "16", label: "16 px" }]} />
        <Toggle label="Snap to 10 px grid" checked={snap} onChange={(event) => setSnap(event.currentTarget.checked)} />
        <Button variant="outline" onClick={() => { setOffset({ x: 0, y: 0 }); setResetKey((key) => key + 1); }}>Reset position</Button>
      </HStack>

      <DragGesture
        key={resetKey}
        aria-label="Move this tile with a pointer or arrow keys"
        role="button"
        axis={axis}
        bounds={{ left: 0, right: 80, top: 0, bottom: 80 }}
        snap={snap ? 10 : undefined}
        keyboardStep={Number(keyboardStep)}
        onDrag={setOffset}
      >
        <Surface tone="accent" padding="lg">
          <Text weight="semibold">Drag or focus and use arrow keys</Text>
        </Surface>
      </DragGesture>
      <Text as="p" role="status" aria-live="polite">Position: {offset.x}, {offset.y} px</Text>
    </VStack>
  );
}
