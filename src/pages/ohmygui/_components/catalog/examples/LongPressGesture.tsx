import { useState } from "react";
import { Grid, LongPressGesture, Picker, Surface, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [duration, setDuration] = useState("600");
  const [threshold, setThreshold] = useState("8");
  const [count, setCount] = useState(0);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Hold duration" value={duration} onChange={(event) => setDuration(event.currentTarget.value)} items={[{ value: "400", label: "400 ms" }, { value: "600", label: "600 ms" }, { value: "900", label: "900 ms" }]} />
        <Picker label="Move to cancel" value={threshold} onChange={(event) => setThreshold(event.currentTarget.value)} items={[{ value: "8", label: "8 px" }, { value: "16", label: "16 px" }, { value: "32", label: "32 px" }]} />
      </Grid>
      <LongPressGesture duration={Number(duration)} threshold={Number(threshold)} onLongPress={() => setCount((value) => value + 1)}>
        <Surface tone="accent" padding="lg">
          <Text weight="semibold">Hold for {duration} ms or press Enter / Space.</Text>
        </Surface>
      </LongPressGesture>
      <Text as="p" role="status">Activated {count} times.</Text>
    </VStack>
  );
}
