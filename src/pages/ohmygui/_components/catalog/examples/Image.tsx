import { Image } from "@/_components/common/ohmygui/content/Image";

export default function Example() {
  return (
    <Image src="/ohmygui/landscape.svg" alt="Illustrated green hills beneath a warm sun" fit="cover" width={420} height={260} style={{ maxWidth: "100%", height: "auto", borderRadius: 16 }} />
  );
}
