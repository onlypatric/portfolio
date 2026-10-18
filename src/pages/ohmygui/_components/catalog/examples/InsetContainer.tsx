import { InsetContainer } from "@/_components/common/ohmygui/layout/InsetContainer";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <InsetContainer maxWidth={420} padding="lg">
      <GroupBox title="Field note · April 18">
      <Text as="p">Crocuses flowered three days after the rain.</Text>
      </GroupBox>
      </InsetContainer>
  );
}
