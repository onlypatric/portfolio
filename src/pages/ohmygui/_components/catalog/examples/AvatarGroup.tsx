import { Avatar, AvatarGroup, HStack, Text, VStack } from "@/ohmygui";

const members = [
  { name: "Mira Chen", presence: "online" as const },
  { name: "Robin Lane", presence: "online" as const },
  { name: "Alex Park", presence: "away" as const },
  { name: "Sam Rivera", presence: "offline" as const },
  { name: "Jordan Kim", presence: "online" as const },
];

export default function Example() {
  return (
    <VStack gap="sm" align="start">
      <HStack gap="md" align="center" wrap>
        <AvatarGroup label="Design team">
          {members.map((member) => <Avatar key={member.name} alt={member.name} palette="auto" presence={member.presence} />)}
        </AvatarGroup>
        <Text as="p" variant="metadata" color="muted">{members.length} collaborators · overlapping avatars</Text>
      </HStack>
    </VStack>
  );
}
