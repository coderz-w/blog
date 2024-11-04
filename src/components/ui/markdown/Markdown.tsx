'use client';

import { clsx } from 'clsx';
import type { MarkdownToJSX } from 'markdown-to-jsx';
import { compiler } from 'markdown-to-jsx';
import Script from 'next/script';
import type React from 'react';
import type { FC, PropsWithChildren } from 'react';
import { memo, Suspense, useMemo, useRef } from 'react';

import { MParagraph } from './renderbers/paragraph';

export interface MdProps {
  value?: string;
  style?: React.CSSProperties;
  readonly renderers?: Record<string, Partial<MarkdownToJSX.Rule>>;
  wrapperProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  codeBlockFully?: boolean;
  className?: string;
  as?: React.ElementType;
  allowsScript?: boolean;
  removeWrapper?: boolean;
}

export const Markdown: FC<MdProps & MarkdownToJSX.Options & PropsWithChildren & any> = memo(
  (props) => {
    const {
      value,
      renderers,
      style,
      wrapperProps = {},
      codeBlockFully = false,
      className,
      overrides,
      extendsRules,
      additionalParserRules,
      as: As = 'div',
      allowsScript = false,
      removeWrapper = false,
      ...rest
    } = props;

    console.log(renderers);

    const ref = useRef<HTMLDivElement>(null);

    const node = useMemo(() => {
      const mdContent = value || props.children;

      if (!mdContent) return null;
      if (typeof mdContent !== 'string') return null;

      const mdElement = compiler(mdContent, {
        doNotProcessHtmlElements: ['tab', 'style', 'script'] as any[],
        wrapper: null,
        overrides: {
          p: MParagraph,
          script: allowsScript ? Script : undefined,
          ...overrides,
        },
        extendsRules: {
          ...extendsRules,
          ...renderers,
        },
        additionalParserRules: {
          // Additional parser rules can be defined here
          ...additionalParserRules,
        },
        ...rest,
      });

      return mdElement;
    }, [
      value,
      props.children,
      allowsScript,
      overrides,
      extendsRules,
      renderers,
      additionalParserRules,
      rest,
    ]);

    if (removeWrapper) return <Suspense>{node}</Suspense>;

    return (
      <Suspense>
        <As
          style={style}
          {...wrapperProps}
          ref={ref}
          className={clsx('md', codeBlockFully ? 'code-fully' : undefined, className)}
        >
          {node}
        </As>
      </Suspense>
    );
  },
);

Markdown.displayName = 'Markdown';

export const MainMarkdown: FC<MdProps & MarkdownToJSX.Options & PropsWithChildren> = (props) => {
  const { wrapperProps = {} } = props;

  return (
    <Markdown
      as="main"
      {...props}
      wrapperProps={useMemo(
        () => ({
          ...wrapperProps,
        }),
        [wrapperProps],
      )}
    />
  );
};
