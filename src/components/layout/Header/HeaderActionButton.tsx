import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

export const HeaderActionButton = ({ children, ...rest }: PropsWithChildren) => (
  <div
    role="button"
    tabIndex={1}
    className={clsx(
      'group size-10 rounded-full bg-base-100',
      'px-3 text-sm ring-1 ring-zinc-900/5 transition dark:ring-white/10 dark:hover:ring-white/20',
      'center flex',
    )}
    {...rest}
    aria-label="Header Action"
  >
    {children}
  </div>
);
