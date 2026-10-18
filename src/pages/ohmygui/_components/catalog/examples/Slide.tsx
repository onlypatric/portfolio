import { useState } from "react";
import { Slide } from "@/_components/common/ohmygui/behavior/Slide";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [replay, setReplay] = useState(0);
  return <VStack gap="lg">
    <Button variant="outline" onClick={() => setReplay(value => value + 1)}>Replay</Button>
    <Slide replayKey={replay} duration={650} direction="start" distance={28}>
      <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
    </Slide>
  </VStack>;
}
