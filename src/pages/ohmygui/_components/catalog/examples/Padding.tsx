import { Background } from "@/_components/common/ohmygui/layout/Background";
import { Padding } from "@/_components/common/ohmygui/layout/Padding";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <Background fill="var(--ui-selection)" style={{ borderRadius: 16 }}>
      <Padding padding="xl">
      <Text>Extra-large padding from the theme.</Text>
      </Padding>
      </Background>
  );
}
