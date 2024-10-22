import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/helper';

export const NormalContainer = (props: PropsWithChildren & { className?: string }) => {
  const { children, className } = props;

  return (
    <div
      className={cn(
        'mx-auto mt-14 max-w-3xl px-2 lg:mt-[80px] lg:px-0 2xl:max-w-4xl',
        '[&_header.prose]:mb-[80px]',
        className,
      )}
    >
      {children}
    </div>
  );
};
