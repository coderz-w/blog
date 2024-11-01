'use client';

import { PropsWithChildren } from 'react';

import styles from './header.module.css';

import { cn } from '@/lib/helper';

export const HeaderLogoArea = ({ children }: PropsWithChildren) => (
  <div className={cn('relative', styles['header--grid__logo'])}>
    <div className={cn('relative flex size-full items-center justify-center')}>{children}</div>
  </div>
);

export const HeaderLeftButtonArea = ({ children }: PropsWithChildren) => (
  <div
    className={cn('relative flex size-full items-center justify-center [grid-area:left] lg:hidden')}
  >
    {children}
  </div>
);

export const HeaderCenterArea = ({ children }: PropsWithChildren) => (
  <div className=" hidden [grid-area:center] lg:flex min-w-0 grow">
    <div className="relative flex grow items-center justify-center">{children}</div>
  </div>
);
