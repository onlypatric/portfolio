import { useCallback, useState } from "react";
import { GeometryReader, Surface, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [resizeStatus, setResizeStatus] = useState("Waiting for first measurement…");
  const handleResize = useCallback(({ width, height }: { width: number; height: number }) => {
    setResizeStatus(`Resize callback: ${Math.round(width)} × ${Math.round(height)}px`);
  }, []);

  return (
    <VStack align="stretch" gap="sm">
      <GeometryReader observe onResize={handleResize}>
        {({ width, height }) => (
          <Surface tone="paper" padding="lg">
            <Text as="p">Measured content: {Math.round(width)} × {Math.round(height)}px</Text>
          </Surface>
        )}
      </GeometryReader>
      <Text variant="metadata" color="muted">{resizeStatus}</Text>
    </VStack>
  );
}
