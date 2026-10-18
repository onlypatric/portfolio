import { Stepper } from "@/_components/common/ohmygui/input/Stepper";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";

export default function Example() {
  return (
    <VStack gap="lg">
      <Stepper label="Seats" name="seats" defaultValue={3} min={1} max={10} step={1} />
      <Stepper label="Opacity" defaultValue={.25} min={.05} max={.95} step={.1} />
      <Stepper label="Monthly limit · read only" defaultValue={5} readOnly />
    </VStack>
  );
}
