import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';

import ProviderComposer from '@/components/modules/shared/ProviderComposer';

const webAppContexts: JSX.Element[] = [<ThemeProvider children key="themeProvider" />];

export default function WebAppProviders({ children }: PropsWithChildren) {
  return <ProviderComposer contexts={webAppContexts}>{children}</ProviderComposer>;
}
