import { useRef, useState } from "react";
import { Button, Collapse, HStack, Picker, TextField, VStack } from "@/ohmygui";

export default function Example() {
  const [visible, setVisible] = useState(true);
  const [duration, setDuration] = useState("400");
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <VStack gap="md" align="stretch">
      <HStack gap="sm" wrap align="center">
        <Button ref={trigger} aria-expanded={visible} aria-controls="collapse-example-details" onClick={() => setVisible((value) => !value)}>
          {visible ? "Hide details" : "Show details"}
        </Button>
        <Picker label="Duration" value={duration} onChange={(event) => setDuration(event.currentTarget.value)} items={[{ value: "200", label: "Quick · 200 ms" }, { value: "400", label: "Default · 400 ms" }, { value: "700", label: "Slow · 700 ms" }]} />
      </HStack>
      <Collapse
        id="collapse-example-details"
        visible={visible}
        exitFocusRef={trigger}
        duration={Number(duration)}
      >
        <TextField
          label="Campaign headline"
          defaultValue="Spring arrivals for the garden"
        />
      </Collapse>
    </VStack>
  );
}
