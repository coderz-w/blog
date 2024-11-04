import React, { PropsWithChildren } from 'react';

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
