import { useState } from "react";
import { HStack, Picker, ResizableSplitPane, Surface, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [ratio, setRatio] = useState(0.4);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [resizable, setResizable] = useState(true);
  const [breakpoint, setBreakpoint] = useState("600");
  return (
    <VStack gap="sm" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Orientation" value={orientation} onChange={(event) => setOrientation(event.currentTarget.value as typeof orientation)} items={[{ value: "horizontal", label: "Side by side" }, { value: "vertical", label: "Top and bottom" }]} />
        <Picker label="Stack below" value={breakpoint} onChange={(event) => setBreakpoint(event.currentTarget.value)} items={[{ value: "false", label: "Never" }, { value: "480", label: "480 px" }, { value: "600", label: "600 px" }, { value: "760", label: "760 px" }]} />
        <Toggle label="Allow resizing" checked={resizable} onChange={(event) => setResizable(event.currentTarget.checked)} />
      </HStack>
      <ResizableSplitPane
        orientation={orientation}
        mobileBreakpoint={breakpoint === "false" ? false : Number(breakpoint)}
        resizable={resizable}
        ratio={ratio}
        onRatioChange={setRatio}
        min={0.25}
        max={0.75}
        label="Resize notes and preview"
      >
        <Surface tone="paper" padding="md">
          <Text weight="semibold">Notes</Text>
        </Surface>
        <Surface tone="contrast" padding="md">
          <Text weight="semibold">Preview</Text>
        </Surface>
      </ResizableSplitPane>
      <Text variant="metadata" color="muted">Notes pane · {Math.round(ratio * 100)}%{breakpoint !== "false" ? ` · stacks below ${breakpoint}px` : ""}</Text>
    </VStack>
  );
}
