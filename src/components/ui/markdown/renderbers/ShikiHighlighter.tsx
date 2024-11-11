'use server';

import { createHighlighter, Highlighter } from 'shiki';
import { FC } from 'react';

interface ShikiHighlighterProps {
  lang: string;
  content: string;
}

const allowLanguages = [
  'javascript',
  'css',
  'jsx',
  'json',
  'less',
  'markdown',
  'vue',
  'wasm',
  'yaml',
  'typescript',
];

let highlighter: Highlighter | null = null;

// 初始化 Shiki highlighter
const getHighlighter = async () => {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['min-light', 'nord'],
      langs: [...allowLanguages],
    });
  }

  return highlighter;
};

export const ShikiHighlighter: FC<ShikiHighlighterProps> = async ({ lang, content }) => {
  const highlighter = await getHighlighter();

  const highlightedCode = highlighter.codeToHtml(content, {
    lang: allowLanguages.includes(lang) ? lang : 'javascript',
    themes: {
      light: 'min-light',
      dark: 'nord',
    },
  });

  return <div className="code-card" dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
};
