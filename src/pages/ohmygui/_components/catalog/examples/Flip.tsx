import { useState } from "react";
import { Flip } from "@/_components/common/ohmygui/behavior/Flip";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [replay, setReplay] = useState(0);
  return <VStack gap="lg">
    <Button variant="outline" onClick={() => setReplay(value => value + 1)}>Replay flip</Button>
    <Flip replayKey={replay} duration={650} axis="y">
      <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
    </Flip>
  </VStack>;
}
