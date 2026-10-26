import { Badge, HStack } from "@/ohmygui";

export default function Example() {
  return (
    <HStack gap="sm" wrap>
      <Badge variant="accent" size="lg">
        Accent
      </Badge>
      <Badge variant="success" tone="soft">
        Ready
      </Badge>
      <Badge variant="warning" tone="outline">
        In review
      </Badge>
      <Badge variant="danger" tone="soft">
        Blocked
      </Badge>
      <Badge
        count={128}
        maxCount={99}
        size="sm"
        aria-label="99 or more unread messages"
      />
    </HStack>
  );
}
