'use client';

import clsx from 'clsx';
import { m } from 'framer-motion';
import type { FC } from 'react';
import React, {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { ITocItem } from './TocItem';
import { TocItem } from './TocItem';

import { Divider } from '@/components/ui/divider';
import { useStateToRef } from '@/hooks/common/use-state-ref';
import { cn } from '@/lib/helper';
import { springScrollToElement } from '@/lib/scroller';

// 使用 `useState` 来管理本地的 activeId 状态
function useActiveId($headings: HTMLHeadingElement[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTransition(() => {
              if (activeId != entry.target.id) {
                setActiveId(entry.target.id);

                const { state } = history;
                history.replaceState(state, '', `#${entry.target.id}`);
              }
            });
          }
        });
      },
      { rootMargin: `-100px 0px -100px 0px` },
    );

    $headings.forEach(($heading) => {
      observer.observe($heading);
    });

    return () => {
      observer.disconnect();
    };
  }, [$headings]);

  return [activeId, setActiveId] as const;
}

export const TocTree = ({
  $headings,
  containerRef,
  className,
  accessory,
  onItemClick,
}: {
  $headings: HTMLHeadingElement[];
  containerRef?: React.MutableRefObject<HTMLUListElement | null>;
  onItemClick?: (item: ITocItem) => void;
  className?: string;
  accessory?: React.ReactNode | React.FC;
}) => {
  const [activeId, setActiveId] = useActiveId($headings);

  const toc: ITocItem[] = useMemo(() => {
    return Array.from($headings).map((el, idx) => {
      const depth = +el.tagName.slice(1);
      const elClone = el.cloneNode(true) as HTMLElement;
      elClone.querySelectorAll('del, .katex-container').forEach((del) => {
        del.remove();
      });

      const title = elClone.textContent || '';
      const index = idx;

      return {
        depth,
        index: Number.isNaN(index) ? -1 : index,
        title,
        anchorId: el.id,
        $heading: el,
      };
    });
  }, [$headings]);

  const rootDepth = useMemo(
    () =>
      toc?.length
        ? (toc.reduce(
            (d: number, cur) => Math.min(d, cur.depth),
            toc[0]?.depth || 0,
          ) as any as number)
        : 0,
    [toc],
  );

  const tocRef = useStateToRef(toc);
  const handleScrollTo = useCallback((i: number, $el: HTMLElement | null, anchorId: string) => {
    onItemClick?.(tocRef.current[i]);

    if ($el) {
      const handle = () => {
        springScrollToElement($el, -100).then(() => {
          setActiveId?.(anchorId);

          const { state } = history;
          history.replaceState(state, '', `#${anchorId}`);
        });
      };

      handle();
    }
  }, []);

  const accessoryElement = useMemo(() => {
    if (!accessory) return null;

    return React.isValidElement(accessory) ? accessory : React.createElement(accessory as FC);
  }, [accessory]);

  return (
    <ul className={cn('scrollbar-none flex grow flex-col px-2', className)} ref={containerRef}>
      <ul className={clsx('scrollbar-none overflow-auto')}>
        {toc?.map((heading) => (
          <MemoedItem
            heading={heading}
            isActive={heading.anchorId === activeId}
            key={`${heading.title}-${heading.index}`}
            rootDepth={rootDepth}
            onClick={handleScrollTo}
          />
        ))}
      </ul>
      {accessoryElement && (
        <li className="shrink-0">
          {toc.length > 0 && <Divider />}
          {accessoryElement}
        </li>
      )}
    </ul>
  );
};

const MemoedItem = memo<{
  isActive: boolean;
  heading: ITocItem;
  rootDepth: number;
  onClick?: (i: number, $el: HTMLElement | null, anchorId: string) => void;
}>((props) => {
  const { heading, isActive, onClick, rootDepth } = props;
  const itemRef = useRef<HTMLLIElement>(null);

  console.log(heading);

  return (
    <m.li
      initial={{ x: 60, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: {
          delay: 0.1 * heading.index,
          type: 'spring',
          stiffness: 300,
          damping: 20,
          duration: 0.5,
        },
      }}
      key={heading.title}
      className="relative leading-none"
      ref={itemRef}
    >
      {isActive && (
        <m.span
          layoutId="active-toc-item"
          layout
          className="absolute inset-y-[3px] left-0 w-[2px] rounded-sm bg-accent"
        />
      )}
      <TocItem
        heading={heading}
        onClick={onClick}
        active={isActive}
        key={heading.title}
        rootDepth={rootDepth}
      />
    </m.li>
  );
});
MemoedItem.displayName = 'MemoedItem';
