'use client';

import { HeaderActionButton } from './HeaderActionButton';
import { HeaderDrawerContent } from './HeaderDrawerContent';

import { IHeaderMenu } from '~/router';
import { PresentSheet } from '@/components/ui/sheet';
import useIsClient from '@/hooks/common/use-is-client';

export const HeaderDrawerButton = ({ headerMenu }: { headerMenu: IHeaderMenu[] }) => {
  const isClient = useIsClient();
  const ButtonElement = (
    <HeaderActionButton aria-label="header draw button">
      <i className="i-mingcute-menu-line" />
    </HeaderActionButton>
  );
  if (!isClient) return ButtonElement;

  return (
    <PresentSheet content={<HeaderDrawerContent headerMenu={headerMenu} />}>
      {ButtonElement}
    </PresentSheet>
  );
};
