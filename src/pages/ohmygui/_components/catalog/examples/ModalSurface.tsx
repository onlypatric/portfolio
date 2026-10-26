import { useRef, useState } from "react";
import { Button, Grid, ModalSurface, Picker, Text, Toggle, VStack } from "@/ohmygui";

const placements = ["center", "end", "bottom"] as const;
const sizes = ["sm", "md", "lg", "full"] as const;

export default function Example() {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<(typeof placements)[number]>("end");
  const [size, setSize] = useState<(typeof sizes)[number]>("sm");
  const [blurBackdrop, setBlurBackdrop] = useState(true);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Placement" value={placement} onChange={(event) => setPlacement(event.currentTarget.value as typeof placement)} items={placements.map((value) => ({ value, label: value }))} />
        <Picker label="Size" value={size} onChange={(event) => setSize(event.currentTarget.value as typeof size)} items={sizes.map((value) => ({ value, label: value }))} />
        <Toggle label="Blur backdrop" checked={blurBackdrop} onChange={(event) => setBlurBackdrop(event.currentTarget.checked)} />
      </Grid>
      <Button ref={trigger} onClick={() => setOpen(true)}>Open modal surface</Button>
      <ModalSurface
        open={open}
        triggerRef={trigger}
        onClose={() => setOpen(false)}
        placement={placement}
        size={size}
        material={{ blur: "18px", opacity: 0.9 }}
        backdropMaterial={blurBackdrop ? { blur: "8px", opacity: 0.45, tint: "#000" } : false}
        title="Reading list"
        description="The base surface supports placement and material options."
        actions={<Button onClick={() => setOpen(false)}>Close</Button>}
      >
        <Text as="p">Use Dialog or FullScreenCover for their named layouts.</Text>
      </ModalSurface>
    </VStack>
  );
}
