import { useState } from "react";
import { Animation, Button, GroupBox, HStack, Picker, Text, TextField, Toggle, VStack } from "@/ohmygui";

const effects = ["fade", "slide", "scale", "rotate", "flip", "reveal", "collapse", "bounce", "shake", "pulse", "float"] as const;
const exits = ["fade", "slide", "scale", "collapse"] as const;
const directions = ["up", "down", "left", "right"] as const;
const motionTokens = ["gentle", "snappy", "spring"] as const;
const options = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

export default function Example() {
  const [visible, setVisible] = useState(true);
  const [draft, setDraft] = useState("Ship the spring collection");
  const [effect, setEffect] = useState<(typeof effects)[number]>("slide");
  const [exit, setExit] = useState<(typeof exits)[number]>("fade");
  const [direction, setDirection] = useState<(typeof directions)[number]>("up");
  const [motionToken, setMotionToken] = useState<(typeof motionTokens)[number]>("gentle");
  const [duration, setDuration] = useState("420");
  const [unmountOnExit, setUnmountOnExit] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [message, setMessage] = useState("Animation ready.");

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Entrance" value={effect} onChange={(event) => setEffect(event.currentTarget.value as typeof effect)} items={options(effects)} />
        <Picker label="Exit" value={exit} onChange={(event) => setExit(event.currentTarget.value as typeof exit)} items={options(exits)} />
        <Picker label="Direction" value={direction} onChange={(event) => setDirection(event.currentTarget.value as typeof direction)} items={options(directions)} />
        <Picker label="Motion feel" value={motionToken} onChange={(event) => setMotionToken(event.currentTarget.value as typeof motionToken)} items={options(motionTokens)} />
        <Picker label="Duration" value={duration} onChange={(event) => setDuration(event.currentTarget.value)} items={[{ value: "220", label: "220 ms" }, { value: "420", label: "420 ms" }, { value: "700", label: "700 ms" }]} />
      </HStack>

      <HStack gap="sm" align="center" wrap>
        <Button onClick={() => setVisible((current) => !current)}>{visible ? "Play exit" : "Show again"}</Button>
        <Button variant="outline" onClick={() => { setVisible(true); setReplayKey((key) => key + 1); }}>Replay entrance</Button>
        <Toggle label="Unmount after exit" checked={unmountOnExit} onChange={(event) => setUnmountOnExit(event.currentTarget.checked)} />
      </HStack>

      <Animation
        visible={visible}
        effect={effect}
        exit={exit}
        direction={direction}
        motionToken={motionToken}
        duration={Number(duration)}
        replayKey={replayKey}
        unmountOnExit={unmountOnExit}
        onEnterComplete={() => setMessage("Entrance finished.")}
        onExitComplete={() => setMessage("Exit finished.")}
      >
        <GroupBox title="Campaign draft">
          <TextField label="Headline" value={draft} onChange={(event) => setDraft(event.currentTarget.value)} />
        </GroupBox>
      </Animation>

      <Text as="p" variant="metadata" role="status" aria-live="polite">{message} The draft stays editable across transitions.</Text>
    </VStack>
  );
}
