import { useState } from "react";
import { Avatar, HStack, NavigationLink, NavigationTitle, Picker, VStack } from "@/ohmygui";

export default function Example() {
  const [size, setSize] = useState<"default" | "section" | "compact">("section");
  const [level, setLevel] = useState<1 | 2 | 3>(2);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Title size" value={size} onChange={(event) => setSize(event.currentTarget.value as typeof size)} items={[{ value: "default", label: "Default" }, { value: "section", label: "Section" }, { value: "compact", label: "Compact" }]} />
        <Picker label="Heading level" value={String(level)} onChange={(event) => setLevel(Number(event.currentTarget.value) as typeof level)} items={[{ value: "1", label: "H1" }, { value: "2", label: "H2" }, { value: "3", label: "H3" }]} />
      </HStack>
      <NavigationTitle
        level={level}
        size={size}
        eyebrow="YOUR LIBRARY"
        title="A place for your next idea"
        subtitle="Long titles and supporting details wrap naturally."
        leading={<Avatar alt="Mira Chen" initials="MC" palette="sky" />}
        trailing={<NavigationLink href="/ohmygui">Browse library</NavigationLink>}
      />
    </VStack>
  );
}
