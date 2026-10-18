import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { RangeSlider } from "@/_components/common/ohmygui/input/RangeSlider";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [low, setLow] = useState(25);
  const [high, setHigh] = useState(75);
  return (
    <VStack gap="md">
      <RangeSlider label="Price range" lowName="minimum" highName="maximum" low={low} high={high} min={0} max={100} onLowChange={setLow} onHighChange={setHigh} lowLabel="Minimum price" highLabel="Maximum price" />
      <Text as="p" role="status">Range: {low}–{high}</Text>
      </VStack>
  );
}
