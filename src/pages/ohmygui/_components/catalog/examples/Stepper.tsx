import { useState } from "react";
import { Stepper, VStack } from "@/ohmygui";

export default function Example() {
  const [seats, setSeats] = useState(3);

  return (
    <VStack gap="lg">
      <Stepper
        label="Seats"
        name="seats"
        value={seats}
        onValueChange={setSeats}
        min={1}
        max={10}
        step={1}
      />
      <Stepper
        label="Opacity"
        defaultValue={0.25}
        min={0.05}
        max={0.95}
        step={0.1}
      />
      <Stepper label="Monthly limit · read only" defaultValue={5} readOnly />
    </VStack>
  );
}
