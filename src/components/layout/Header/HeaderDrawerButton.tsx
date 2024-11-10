'use client';

import { HeaderActionButton } from './HeaderActionButton';
import { HeaderDrawerContent } from './HeaderDrawerContent';

import { PresentSheet } from '@/components/ui/sheet';
import useIsClient from '@/hooks/common/use-is-client';

export const HeaderDrawerButton = () => {
  const isClient = useIsClient();
  const ButtonElement = (
    <HeaderActionButton aria-label="header draw button">
      <i className="i-mingcute-menu-line" />
    </HeaderActionButton>
  );
  if (!isClient) return ButtonElement;

  return <PresentSheet content={<HeaderDrawerContent />}>{ButtonElement}</PresentSheet>;
};
