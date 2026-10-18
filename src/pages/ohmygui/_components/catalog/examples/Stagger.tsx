import { useState } from "react";
import { Stagger } from "@/_components/common/ohmygui/behavior/Stagger";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [replay, setReplay] = useState(0);
  return <VStack gap="lg">
    <Button variant="outline" onClick={() => setReplay(value => value + 1)}>Replay sequence</Button>
    <Stagger replayKey={replay} stagger={110} duration={500}>
      <GroupBox title="09:12 · Received"><Text>Order #1048</Text></GroupBox>
      <GroupBox title="09:18 · Packed"><Text>Field guide · 2 copies</Text></GroupBox>
      <GroupBox title="09:24 · Dispatched"><Text>Tracking is ready</Text></GroupBox>
    </Stagger>
  </VStack>;
}
