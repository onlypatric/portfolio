import { GroupBox, HStack, Text, VStack } from "@/ohmygui";

export default function Example() {
  return (
    <VStack align="stretch" gap="sm">
      <GroupBox title="Workspace details" variant="bordered" padding="md">
        <VStack gap="sm">
          <HStack justify="between"><Text color="muted">Name</Text><Text>Personal studio</Text></HStack>
          <HStack justify="between"><Text color="muted">Members</Text><Text>3 people</Text></HStack>
        </VStack>
      </GroupBox>
      <GroupBox variant="filled" padding="sm" aria-label="Workspace note">
        <Text color="muted">A compact filled group without a legend.</Text>
      </GroupBox>
    </VStack>
  );
}
