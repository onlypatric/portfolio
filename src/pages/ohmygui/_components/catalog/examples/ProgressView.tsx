import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { ProgressView } from "@/_components/common/ohmygui/input/ProgressView";

export default function Example() {
  const [progress, setProgress] = useState(40);
  return (
    <VStack gap="md">
      <ProgressView label="Preparing your workspace" value={progress} max={100} />
      <Button variant="outline" onClick={() => setProgress((value) => value >= 100 ? 0 : value + 20)}>Advance progress</Button>
      <ProgressView label="Waiting for the next task" />
      </VStack>
  );
}
