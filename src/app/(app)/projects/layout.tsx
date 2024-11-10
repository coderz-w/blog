import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { NormalContainer } from '@/components/layout/container/Normal';

export const metadata: Metadata = {
  title: '看看我在做啥',
  description: '一些小玩具',
};

export default async function (props: PropsWithChildren) {
  return <NormalContainer>{props.children}</NormalContainer>;
}
