import { useState } from "react";
import { Button, Card, Group, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [fill, setFill] = useState(true);

  return (
    <VStack gap="sm" align="stretch">
      <Toggle label="Fill available height" checked={fill} onChange={(event) => setFill(event.currentTarget.checked)} />
      <Group className="h-[240px]">
        <Card as="article" fill={fill} appearance="outlined" tone="paper" padding="md"
          header={<Text as="h3" variant="title">Design review</Text>}
          footer={<Button variant="outline">Open notes</Button>}
        >
          <Text color="muted">Header, body, and footer share one surface contract.</Text>
        </Card>
      </Group>
    </VStack>
  );
}
