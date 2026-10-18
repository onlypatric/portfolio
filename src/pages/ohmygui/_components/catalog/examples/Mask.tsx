import { Mask } from "@/_components/common/ohmygui/drawing/Mask";
import { Image } from "@/_components/common/ohmygui/content/Image";

export default function Example() {
  return (
    <Mask shape="circle" mode="clip" style={{ width: 180, height: 180 }}>
      <Image src="/ohmygui/landscape.svg" alt="A circular view of illustrated hills" width={180} height={180} fit="cover" />
      </Mask>
  );
}
