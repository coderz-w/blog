'use client';

import { useEffect, useState } from 'react';
import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

export default function GS({ lang }: { lang: 'zh' | 'en' }) {
  const { theme, systemTheme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'system') {
      setResolvedTheme(
        systemTheme ??
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
      );
    } else {
      setResolvedTheme(theme as 'light' | 'dark');
    }
  }, [theme, systemTheme]);

  return (
    <div className="mt-16">
      <Giscus
        id="comments"
        repo="coderz-w/blog"
        repoId="R_kgDOMhALnA"
        category="Announcements"
        categoryId="DIC_kwDOMhALnM4CpMFu"
        mapping="pathname"
        term=""
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme}
        lang={lang === 'en' ? lang : 'zh-CN'}
        loading="lazy"
      />
    </div>
  );
}
