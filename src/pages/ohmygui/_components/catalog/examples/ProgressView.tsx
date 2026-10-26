import { useState } from "react";
import { Button, ProgressView, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [progress, setProgress] = useState(40);
  const [showValue, setShowValue] = useState(true);
  return (
    <VStack gap="md" align="stretch">
      <ProgressView
        label="Preparing project files"
        value={progress}
        max={100}
        showValue={showValue}
        formatValue={(value, max) => `${value} of ${max} files`}
      />
      <Toggle label="Show progress value" checked={showValue} onChange={(event) => setShowValue(event.currentTarget.checked)} />
      <Button
        variant="outline"
        onClick={() => setProgress((value) => (value >= 100 ? 0 : value + 20))}
      >
        Advance progress
      </Button>
      <ProgressView label="Waiting for the next task" />
    </VStack>
  );
}
