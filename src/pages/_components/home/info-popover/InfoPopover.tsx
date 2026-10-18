import { Button, Popover } from "@heroui/react";
import { SealQuestionIcon } from "@phosphor-icons/react";

export default function InfoPopover() {
  return (
    <Popover>
      <Button aria-label="More information" isIconOnly variant="ghost">
        <SealQuestionIcon className="fill-olive-500" />
      </Button>
      <Popover.Content className="max-w-64">
        <Popover.Arrow />
        <Popover.Dialog>
          <Popover.Heading>This website is mostly human-made</Popover.Heading>
          <p className="mt-2 text-sm text-muted">
            There may be some bugs, but that's part of being <span className="text-emerald-500">alive</span>!
          </p>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
