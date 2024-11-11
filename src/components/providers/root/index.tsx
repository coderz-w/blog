'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { LazyMotion } from 'framer-motion';

import ProviderComposer from '@/components/modules/shared/ProviderComposer';

const loadFeatures = () => import('./framer-lazy-feature').then((res) => res.default);

const webAppContexts: JSX.Element[] = [
  <ThemeProvider children key="themeProvider" />,
  <LazyMotion features={loadFeatures} strict key="framer" />,
];

export default function WebAppProviders({ children }: PropsWithChildren) {
  return <ProviderComposer contexts={webAppContexts}>{children}</ProviderComposer>;
}
