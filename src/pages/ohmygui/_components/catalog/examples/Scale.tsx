import { useState } from "react";
import { Scale } from "@/_components/common/ohmygui/behavior/Scale";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [replay, setReplay] = useState(0);
  return <VStack gap="lg">
    <Button variant="outline" onClick={() => setReplay(value => value + 1)}>Replay</Button>
    <Scale replayKey={replay} duration={650} fromScale={0.86}>
      <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
    </Scale>
  </VStack>;
}
