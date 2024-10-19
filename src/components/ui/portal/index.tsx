'use client';

import type { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { useRootPortal } from './provider';

import useIsClient from '@/hooks/common/use-is-client';

export const RootPortal: FC<
  {
    to?: HTMLElement;
  } & PropsWithChildren
> = (props) => {
  const isClient = useIsClient();
  const to = useRootPortal();

  if (!isClient) {
    return null;
  }

  return createPortal(props.children, props.to || to || document.body);
};
