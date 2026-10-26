import { useState } from "react";
import { AsyncImage, Button, Grid, Picker, Text, VStack } from "@/ohmygui";

const fits = ["cover", "contain", "fill", "scale-down"] as const;

export default function Example() {
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [fit, setFit] = useState<(typeof fits)[number]>("cover");
  const [retry, setRetry] = useState("1");

  return (
    <VStack align="stretch" gap="sm">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Image fit" value={fit} onChange={(event) => setFit(event.currentTarget.value as typeof fit)} items={fits.map((value) => ({ value, label: value }))} />
        <Picker label="Retries after failure" value={retry} onChange={(event) => setRetry(event.currentTarget.value)} items={["0", "1", "2"].map((value) => ({ value, label: value }))} />
      </Grid>
      <Button variant="outline" onClick={() => setSimulateFailure(true)} disabled={simulateFailure}>
        Simulate image failure
      </Button>
      <AsyncImage
        src={simulateFailure ? "/ohmygui/missing-landscape.svg" : "/ohmygui/landscape.svg"}
        alt="Illustrated green hills beneath a warm sun"
        width={420}
        height={260}
        aspectRatio="8 / 5"
        fit={fit}
        placeholder={<Text>Loading landscape…</Text>}
        fallback={
          <>
            <Text as="span">Landscape unavailable.</Text>{" "}
            <Button size="sm" variant="outline" onClick={() => setSimulateFailure(false)}>Try again</Button>
          </>
        }
        retry={Number(retry)}
      />
      <Text variant="metadata" color="muted">{simulateFailure ? `Missing image · up to ${retry} retries, then fallback` : "Loaded image · choose a fit mode or simulate a failed source."}</Text>
    </VStack>
  );
}
