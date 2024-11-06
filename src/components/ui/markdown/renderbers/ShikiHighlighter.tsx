import { useEffect, useState } from 'react';
import { createHighlighter, Highlighter } from 'shiki';

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

export const ShikiHighlighter: React.FC<ShikiHighlighterProps> = ({ lang, content }) => {
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);

  useEffect(() => {
    let highlighter: Highlighter;

    const loadHighlighter = async () => {
      highlighter = await createHighlighter({
        themes: ['min-light', 'nord'],
        langs: [...allowLanguages],
      });

      const code = highlighter.codeToHtml(content, {
        lang: allowLanguages.includes(lang) ? lang : 'javascript',
        themes: {
          light: 'min-light',
          dark: 'nord',
        },
      });
      setHighlightedCode(code);
    };

    loadHighlighter();

    return () => {
      highlighter = null as any;
    };
  }, [lang, content]);

  return highlightedCode ? (
    <div className="code-card" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
  ) : null;
};
