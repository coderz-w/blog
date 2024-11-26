'use client';

import { memo, useDeferredValue, useEffect, useState } from 'react';

import { MaterialSymbolsProgressActivity } from '@/components/icons/Progress';
import { MotionButtonBase } from '@/components/ui/button';
import { cn } from '@/lib/helper';
import { springScrollToTop } from '@/lib/scroller';
import { useMainArticleStore } from '@/store/mainArticleStore';

export const ReadIndicator = () => {
  const { Element } = useMainArticleStore();
  const [readPercent, setReadPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!Element) return;

      const elementTop = Element.getBoundingClientRect().top + window.scrollY;
      const scrollTop = window.scrollY;
      const winHeight = window.innerHeight;
      const elementHeight = Element.offsetHeight;
      // 为了解决一开始进度不为0的问题
      const readHeight = scrollTop > winHeight ? scrollTop + winHeight - elementTop : scrollTop;
      const scrollPosition = (readHeight / elementHeight) * 100;
      setReadPercent(Math.floor(Math.min(Math.max(0, scrollPosition), 100)));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [Element]);

  return (
    <div className="text-gray-800 dark:text-neutral-300 gap-4">
      <div className="flex items-center gap-2">
        <MaterialSymbolsProgressActivity progress={readPercent} />
        {readPercent}%<br />
      </div>
      <BackToTop readPercent={useDeferredValue(readPercent)} />
    </div>
  );
};

const BackToTop = memo(({ readPercent }: { readPercent: number }) => {
  return (
    <MotionButtonBase
      onClick={springScrollToTop}
      className={cn(
        'mt-1 flex flex-nowrap items-center gap-2 opacity-50 transition-all duration-500 hover:opacity-100',
        readPercent > 10 ? '' : 'pointer-events-none opacity-0',
      )}
    >
      <i className="i-mingcute-arrow-up-circle-line" />
      <span className="whitespace-nowrap">回到顶部</span>
    </MotionButtonBase>
  );
});
