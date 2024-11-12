'use client';

import type React from 'react';
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { TocTree } from './TocTree';

import { cn } from '@/lib/helper';
import { useMainArticleStore } from '@/store/mainArticleStore';

export type TocAsideProps = {
  treeClassName?: string;
  accessory?: React.ReactNode;
  as?: React.ElementType;
  className?: string;
};

export const TocAside = ({
  className,
  children,
  treeClassName,
  as: As = 'aside',
  accessory,
}: TocAsideProps & PropsWithChildren) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const $article = useMainArticleStore(useShallow((state) => state.Element));

  if ($article === undefined) {
    throw new TypeError('<Toc /> must be used in <WrappedElementProvider />');
  }

  const $headings = useMemo(() => {
    if (!$article) {
      return [];
    }

    return [...$article.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(($heading) => {
      return ($heading as HTMLElement).dataset['markdownHeading'] === 'true';
    }) as HTMLHeadingElement[];
  }, [$article]);
  useEffect(() => {
    const setMaxWidth = () => {
      if (containerRef.current) {
        containerRef.current.style.maxWidth = `${
          window.innerWidth - containerRef.current.getBoundingClientRect().x - 30
        }px`;
      }
    };

    setMaxWidth();

    window.addEventListener('resize', setMaxWidth);

    return () => {
      window.removeEventListener('resize', setMaxWidth);
    };
  }, []);

  return (
    <As className={cn('st-toc z-[3]', 'relative font-sans', className)}>
      <TocTree
        $headings={$headings}
        containerRef={containerRef}
        className={cn('absolute max-h-[75vh]', treeClassName)}
        accessory={accessory}
      />
      {children}
    </As>
  );
};
