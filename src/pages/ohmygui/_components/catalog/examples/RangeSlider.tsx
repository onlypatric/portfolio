import { useState } from "react";
import { Button, HStack, Picker, RangeSlider, Text, Toggle, VStack } from "@/ohmygui";

const initialRange = { low: 25, high: 75 };
const steps = ["1", "5", "10"].map((value) => ({ value, label: value }));
const modes = ["interactive", "readOnly", "disabled"] as const;

export default function Example() {
  const [low, setLow] = useState(initialRange.low);
  const [high, setHigh] = useState(initialRange.high);
  const [step, setStep] = useState("5");
  const [mode, setMode] = useState<"interactive" | "readOnly" | "disabled">("interactive");
  const [showValue, setShowValue] = useState(true);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Step size" value={step} onChange={(event) => setStep(event.currentTarget.value)} items={steps} />
        <Picker label="Interaction" value={mode} onChange={(event) => setMode(event.currentTarget.value as typeof mode)} items={modes.map((value) => ({ value, label: value === "readOnly" ? "Read only" : value[0].toUpperCase() + value.slice(1) }))} />
        <Toggle label="Show range value" checked={showValue} onChange={(event) => setShowValue(event.currentTarget.checked)} />
        <Button variant="outline" onClick={() => { setLow(initialRange.low); setHigh(initialRange.high); }}>Reset range</Button>
      </HStack>
      <RangeSlider
        label="Price range"
        lowName="minimum"
        highName="maximum"
        low={low}
        high={high}
        min={0}
        max={100}
        step={Number(step)}
        onLowChange={setLow}
        onHighChange={setHigh}
        lowLabel="Minimum price"
        highLabel="Maximum price"
        readOnly={mode === "readOnly"}
        disabled={mode === "disabled"}
        showValue={showValue}
      />
      <Text as="p" variant="metadata" role="status" aria-live="polite">Selected range: {low}–{high}</Text>
    </VStack>
  );
}
