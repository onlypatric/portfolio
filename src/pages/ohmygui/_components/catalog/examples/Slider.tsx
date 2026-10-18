import { useState } from "react";
import { Slider } from "@/_components/common/ohmygui/input/Slider";
import { Form } from "@/_components/common/ohmygui/input/Form";
import { Button } from "@/_components/common/ohmygui/control/button/Button";

export default function Example() {
  const [volume, setVolume] = useState(60);
  return (
    <Form onSubmit={event => event.preventDefault()}>
      <Slider label="Volume" name="volume" min={0} max={100} value={volume} onChange={(event) => setVolume(Number(event.target.value))} showValue formatValue={value => value + "%"} />
      <Slider label="Brightness" name="brightness" defaultValue={40} showValue helperText="An uncontrolled slider: Reset restores the starting value." />
      <Button type="reset" size="sm" variant="secondary">Reset sliders</Button>
    </Form>
  );
}
