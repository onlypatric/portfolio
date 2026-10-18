import { useRef, useState } from "react";
import { Collapse } from "@/_components/common/ohmygui/behavior/Collapse";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";

export default function Example() {
  const [visible, setVisible] = useState(true);
  const trigger = useRef<HTMLButtonElement>(null);
  return <VStack gap="md">
    <Button ref={trigger} aria-expanded={visible} aria-controls="collapse-example-details" onClick={() => setVisible(value => !value)}>Toggle details</Button>
    <Collapse id="collapse-example-details" visible={visible} exitFocusRef={trigger} duration={400}>
      <TextField label="Campaign headline" defaultValue="Spring arrivals for the garden" />
    </Collapse>
  </VStack>;
}
