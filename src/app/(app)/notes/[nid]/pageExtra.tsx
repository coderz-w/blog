'use client';

import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { m } from 'framer-motion';

import text from './test.md';

import { MdiClockOutline } from '@/components/icons/clock';
import { cn } from '@/lib/helper';
import { MainMarkdown } from '@/components/ui/markdown';

console.log(text);

export const NoteTitle = () => {
  const title = '我的一篇文章';

  if (!title) return null;

  return (
    <div className="relative">
      <h1 className="my-6 text-balance text-left text-4xl font-bold font-mono leading-tight text-base-content/95">
        {title}
      </h1>
    </div>
  );
};

export const NoteDateMeta = () => {
  return (
    <span className="inline-flex items-center space-x-1">
      <MdiClockOutline />
      <time className="font-medium font-mono">2024年10月27日 星期日</time>
    </span>
  );
};

export const IndentArticleContainer = (props: PropsWithChildren) => {
  return (
    <article className={cn('prose relative', 'with-indent with-serif', ' min-w-full')}>
      {props.children}
    </article>
  );
};

const MarkdownRenderers: Record<string, any> = {
  text: {
    react(node: any, _: any, state: any) {
      return <span key={state?.key}>{node.content}</span>;
    },
  },
};

export const NoteMarkdown = () => {
  return <MainMarkdown className="mt-10" allowsScript renderers={MarkdownRenderers} value={text} />;
};

export const PaperLayout = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
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

export const PageTransition = ({ children }: PropsWithChildren) => {
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
