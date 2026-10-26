import { HStack, Padding, Surface, Text } from "@/ohmygui";

export default function Example() {
  return (
    <HStack gap="sm" align="center" wrap role="group" aria-label="Padding size comparison">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((padding) => (
        <Surface key={padding} tone="paper" padding="none" radius="sm">
          <Padding padding={padding}>
            <Text>{padding}</Text>
          </Padding>
        </Surface>
      ))}
    </HStack>
  );
}
