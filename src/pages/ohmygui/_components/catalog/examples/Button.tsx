import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { Button, HStack, Picker, Text, Toggle, VStack } from "@/ohmygui";

const variants = ["primary", "secondary", "outline", "ghost", "danger"] as const;
const sizes = ["sm", "md", "lg"] as const;
const radii = ["none", "xs", "sm", "md", "lg", "xl", "full"] as const;

export default function Example() {
  const [failSave, setFailSave] = useState(false);
  const [message, setMessage] = useState("Choose a button style.");
  const [radius, setRadius] = useState<(typeof radii)[number]>("md");
  return (
    <VStack gap="md" align="stretch">
      <Picker label="Corner radius" value={radius} onChange={(event) => setRadius(event.currentTarget.value as typeof radius)} items={radii.map((value) => ({ value, label: value }))} />
      <Toggle label="Simulate save failure" checked={failSave} onChange={(event) => setFailSave(event.currentTarget.checked)} />
      <HStack gap="sm" wrap>
        <Button
          radius={radius}
          onPress={async () => {
            setMessage("Saving changes…");
            await new Promise((resolve) => setTimeout(resolve, 450));
            if (failSave) throw new Error("Save failed. Try again.");
            setMessage("Changes saved.");
          }}
          onPressError={(error) => setMessage(error instanceof Error ? error.message : "Save failed. Try again.")}
        >
          Save changes
        </Button>
        {variants.slice(1).map((variant) => <Button key={variant} radius={radius} variant={variant}>{variant[0].toUpperCase() + variant.slice(1)}</Button>)}
        <Button radius={radius} variant="outline"><Plus aria-hidden="true" /> Create item</Button>
        <Button radius={radius} iconOnly variant="outline" aria-label="Create item"><Plus aria-hidden="true" /></Button>
      </HStack>
      <HStack gap="sm" align="center" wrap>
        {sizes.map((size) => <Button key={size} radius={radius} size={size} variant="outline">{size.toUpperCase()}</Button>)}
        <Button radius={radius} loading>Saving…</Button>
        <Button radius={radius} variant="outline" disabled>Unavailable</Button>
        <Button radius={radius} longPress={800} onPress={() => setMessage("Action confirmed.")}>Hold to confirm</Button>
      </HStack>
      <Text as="p" role="status" aria-live="polite">{message}</Text>
    </VStack>
  );
}
