import { Gauge } from "@/_components/common/ohmygui/input/Gauge";
import { Slider } from "@/_components/common/ohmygui/input/Slider";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { useState } from "react";

export default function Example() {
  const [used, setUsed] = useState(64);
  return (
    <VStack gap="md">
      <Gauge label="Storage used" value={used} min={0} max={100} low={25} high={80} optimum={10} formatValue={value => value + "%"} />
      <Slider label="Try a different storage level" min={0} max={100} value={used} onValueChange={setUsed} />
    </VStack>
  );
}
