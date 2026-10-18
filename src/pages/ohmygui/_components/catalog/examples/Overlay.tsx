import { Overlay } from "@/_components/common/ohmygui/layout/Overlay";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return <Overlay decorativeBlur="18px" align="end" style={{ padding: 32, borderRadius: 20, background: "var(--surface-secondary)" }}
    overlay={<div style={{ width: 80, height: 80, background: "var(--accent)", borderRadius: "50%", opacity: .45 }} />}>
    <Text as="p" variant="title">Soft decoration, sharp content.</Text>
  </Overlay>;
}
