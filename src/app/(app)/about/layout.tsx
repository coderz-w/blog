import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { NormalContainer } from '@/components/layout/container/Normal';

export const metadata: Metadata = {
  title: '关于我',
  description: '但愿人长久,千里共婵娟',
};

export default async function (props: PropsWithChildren) {
  return <NormalContainer>{props.children}</NormalContainer>;
}
