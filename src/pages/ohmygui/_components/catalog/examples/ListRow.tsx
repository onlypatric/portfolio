import { ListRow } from "@/_components/common/ohmygui/collection/ListRow";
import { Avatar } from "@/_components/common/ohmygui/content/Avatar";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  return (
    <ul style={{ padding: 0, listStyle: "none" }}>
      <ListRow leading={<Avatar initials="OG" alt="OhMyGUI" />} primary="Personal studio" secondary="A place for the next idea." trailing={<Badge variant="success" tone="soft">Ready</Badge>} />
      </ul>
  );
}
