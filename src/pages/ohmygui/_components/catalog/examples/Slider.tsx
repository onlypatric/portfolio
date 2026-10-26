import { useState } from "react";
import { Button, Form, Slider } from "@/ohmygui";

export default function Example() {
  const [volume, setVolume] = useState(60);
  return (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Slider
        label="Volume"
        name="volume"
        min={0}
        max={100}
        step={5}
        value={volume}
        onValueChange={setVolume}
        showValue
        formatValue={(value) => value + "%"}
      />
      <Slider
        label="Brightness"
        name="brightness"
        defaultValue={40}
        showValue
        helperText="An uncontrolled slider: Reset restores the starting value."
      />
      <Button type="reset" size="sm" variant="secondary">
        Reset sliders
      </Button>
    </Form>
  );
}
