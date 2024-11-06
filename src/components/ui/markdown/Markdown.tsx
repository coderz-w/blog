'use client';

import { clsx } from 'clsx';
import type { MarkdownToJSX } from 'markdown-to-jsx';
import { compiler, sanitizeUrl } from 'markdown-to-jsx';
import Script from 'next/script';
import type React from 'react';
import type { FC, PropsWithChildren } from 'react';
import { memo, Suspense, useMemo, useRef } from 'react';

import { MParagraph } from './renderbers/paragraph';
import { MHeader } from './renderbers/heading';
import { MarkdownImage } from './renderbers/images';
import { MLink } from './renderbers/Mlink';

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
          img: MarkdownImage,
          script: allowsScript ? Script : undefined,
          ...overrides,
        },
        extendsRules: {
          heading: {
            react(node, output, state) {
              return (
                <MHeader id={node.id} level={node.level} key={state?.key}>
                  {output(node.content, state!)}
                </MHeader>
              );
            },
          },
          link: {
            react(node, output, state) {
              const { target, title } = node;

              let realText = '';

              for (const child of node.content) {
                if (child.type === 'text') {
                  realText += child.content;
                }
              }

              return (
                <MLink href={sanitizeUrl(target)!} title={title} key={state?.key} text={realText}>
                  {output(node.content, state!)}
                </MLink>
              );
            },
          },
          codeFenced: {
            parse(capture) {
              return {
                content: capture[4],
                lang: capture[2] || undefined,
                type: 'codeBlock',

                attrs: capture[3],
              };
            },
          },
          codeInline: {
            react(node, output, state) {
              return (
                <code
                  key={state?.key}
                  className="rounded-md bg-zinc-200 px-2 font-mono dark:bg-neutral-800"
                >
                  {node.content}
                </code>
              );
            },
          },
          ...extendsRules,
          ...renderers,
        },
        additionalParserRules: {
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
