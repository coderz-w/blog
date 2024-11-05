'use client';

import { m } from 'framer-motion';
import { PropsWithChildren, useEffect, useRef } from 'react';

import { NoteTitle, NoteDateMeta, IndentArticleContainer, NoteMarkdown } from './pageExtra';

import { cn } from '@/lib/helper';

export default function Page({ params }: { params: Record<string, any> }) {
  const { nid } = params;
  console.log('id', nid);

  return (
    <PageTransition>
      <PaperLayout>
        <PageInner />
      </PaperLayout>
    </PageTransition>
  );
}

const PageTransition = ({ children }: PropsWithChildren) => {
  return (
    <m.div
      initial={{ y: 80, opacity: 0.001 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, type: 'spring', damping: 20, stiffness: 200 },
      }}
      className=" min-w-0"
    >
      {children}
    </m.div>
  );
};

const PaperLayout = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  const paperLayoutRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!paperLayoutRef.current) return;
    //侧边可能需要

    const mainHeight = paperLayoutRef.current.offsetHeight;
    console.log(mainHeight);

    const ob = new ResizeObserver((entries) => {
      const mainHeight = (entries[0].target as HTMLElement).offsetHeight;
      if (mainHeight) console.log(mainHeight);
    });
    ob.observe(paperLayoutRef.current);

    return () => {
      ob.disconnect();
    };
  }, []);

  return (
    <main
      ref={paperLayoutRef}
      className={cn(
        'relative bg-white dark:bg-zinc-900 md:col-start-1 lg:col-auto',
        '-m-4 p-[2rem_1rem] md:m-0 lg:p-[30px_45px]',
        'rounded-[0_6px_6px_0] border-zinc-200/70 shadow-sm dark:border-neutral-800 dark:shadow-[#333] lg:border',
        'note-layout-main',
        'min-w-0',
        className,
      )}
    >
      {children}
    </main>
  );
};

const PageInner = () => (
  <>
    <div>
      <NoteTitle />
      <span className="flex flex-wrap items-center text-sm text-neutral-content/60">
        <NoteDateMeta />
      </span>
    </div>
    <IndentArticleContainer>
      <NoteMarkdown />
    </IndentArticleContainer>
  </>
);
