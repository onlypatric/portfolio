import { Tooltip } from "@/_components/common/ohmygui/presentation/Tooltip";
import { Button } from "@/_components/common/ohmygui/control/button/Button";

export default function Example() {
  return (
    <Tooltip content="Search by title or author." delay={150}>
      <Button variant="outline">Search library</Button>
      </Tooltip>
  );
}
