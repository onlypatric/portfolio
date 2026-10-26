import { useState } from "react";
import { Button, GroupBox, Stagger, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [replay, setReplay] = useState(0);
  return (
    <VStack gap="lg">
      <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>
        Replay sequence
      </Button>
      <Stagger
        replayKey={replay}
        effect="slide"
        stagger={110}
        maxDelay={220}
        duration={500}
        columns={{ compact: 1, regular: 3 }}
        gap="md"
      >
        <GroupBox title="09:12 · Received">
          <Text>Order #1048</Text>
        </GroupBox>
        <GroupBox title="09:18 · Packed">
          <Text>Field guide · 2 copies</Text>
        </GroupBox>
        <GroupBox title="09:24 · Dispatched">
          <Text>Tracking is ready</Text>
        </GroupBox>
      </Stagger>
    </VStack>
  );
}
