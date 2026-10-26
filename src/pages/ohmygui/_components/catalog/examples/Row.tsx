import { Avatar, Row, Text, VStack } from "@/ohmygui";

const members = [
  { name: "Mira Chen", role: "Product designer", presence: "online" as const },
  { name: "Alex Rivera", role: "Frontend engineer", presence: "away" as const },
];

export default function Example() {
  return (
    <VStack role="list" aria-label="Team members" align="stretch">
      {members.map((member, index) => <Row key={member.name} role="listitem" divider={index < members.length - 1}
        leading={<Avatar alt={member.name} palette="auto" presence={member.presence} />}
        title={member.name} description={member.role}
        trailing={<Text variant="metadata" color="muted">{member.presence}</Text>}
      />)}
    </VStack>
  );
}
