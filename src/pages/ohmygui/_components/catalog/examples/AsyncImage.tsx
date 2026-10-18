import { AsyncImage } from "@/_components/common/ohmygui/content/AsyncImage";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <AsyncImage src="/ohmygui/landscape.svg" alt="Illustrated green hills beneath a warm sun" width={420} height={260} aspectRatio="8 / 5" placeholderSrc="/ohmygui/landscape.svg" placeholderBlur="16px" placeholder={<Text>Loading landscape…</Text>} fallback={<Text>Landscape unavailable.</Text>} style={{ maxWidth: 420, borderRadius: 16 }} />
  );
}
