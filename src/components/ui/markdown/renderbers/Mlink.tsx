'use client';

import { useRouter } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import { memo, useCallback } from 'react';

import { FloatPopover } from '@/components/ui/float-popover';
export const MLink: FC<{
  href: string;
  title?: string;
  children?: ReactNode;
  text?: string;
  popper?: boolean;
}> = memo(({ href, children, title, popper = true }) => {
  const router = useRouter();

  const handleRedirect = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const toUrlParser = new URL(href);

      e.preventDefault();

      window.open(toUrlParser.pathname);
    },
    [href, router],
  );

  const el = (
    <span className="inline items-center font-sans px-1 cursor-pointer">
      <span
        className=" relative before:content-[''] before:absolute before:bottom-[-2px] before:w-[0px] hover:before:w-[100%] before:h-[2px] before:bg-[var(--accent-color)] before:transition-all before:duration-300"
        onClick={handleRedirect}
        title={title}
        rel="noreferrer"
      >
        {children}
      </span>

      <i className="i-mingcute-arrow-right-up-line ml-[1px] translate-y-[2px] opacity-70" />
    </span>
  );
  if (!popper) return el;

  return (
    <FloatPopover as="span" wrapperClassName="!inline" type="tooltip" triggerElement={el}>
      <a href={href} target="_blank" rel="noreferrer">
        <span>{href}</span>
      </a>
    </FloatPopover>
  );
});
