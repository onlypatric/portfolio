import { useState } from 'react';
import { ArrowCounterClockwiseIcon, CaretRightIcon, CheckIcon } from '@phosphor-icons/react';
import { Button } from '@/_components/common/ohmygui/control/button/Button';
import { ButtonGroup } from '@/_components/common/ohmygui/control/button/ButtonGroup';
import { HStack } from '@/_components/common/ohmygui/layout';

export default function ModernUXFaultActions() {
  const [restarted, setRestarted] = useState(false);

  return (
    <ButtonGroup aria-label="Example charger fault actions" radius="full">
      <Button
        variant={restarted ? 'primary' : 'danger'}
        longPress={restarted ? undefined : 1000}
        onPress={() => { if (!restarted) setRestarted(true); }}
        aria-disabled={restarted}
      >
        <HStack as="span" align="center" justify="center" gap="sm">
          <span aria-live="polite" aria-atomic="true">{restarted ? 'Chargepoint restarted' : 'Quick restart'}</span>
          {restarted ? <CheckIcon aria-hidden="true" /> : <ArrowCounterClockwiseIcon aria-hidden="true" />}
        </HStack>
      </Button>
      <Button variant="secondary">
        <HStack align="center" justify="center" gap="sm">
          Details <CaretRightIcon aria-hidden="true" />
        </HStack>
      </Button>
    </ButtonGroup>
  );
}
