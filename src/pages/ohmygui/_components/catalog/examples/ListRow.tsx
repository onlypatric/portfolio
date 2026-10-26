import { Avatar, Badge, ListRow, VStack } from "@/ohmygui";

const workspaces = [
  { name: "Personal studio", detail: "A place for the next idea.", initials: "OG", state: "Ready" },
  { name: "Component garden", detail: "A shared space for experiments.", initials: "MC", state: "In progress" },
];

export default function Example() {
  return (
    <VStack as="ul" gap="xs" align="stretch" aria-label="Workspaces">
      {workspaces.map((workspace, index) => (
        <ListRow
          key={workspace.name}
          selected={index === 0}
          leading={<Avatar initials={workspace.initials} alt={workspace.name} />}
          primary={workspace.name}
          secondary={workspace.detail}
          trailing={<Badge tone="soft">{workspace.state}</Badge>}
        />
      ))}
    </VStack>
  );
}
