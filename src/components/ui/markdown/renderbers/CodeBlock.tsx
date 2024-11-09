import { useMemo, Suspense } from 'react';
import { lazy } from 'react';

import { cn } from '@/lib/helper';

export const CodeBlockRender = (props: {
  lang: string | undefined;
  content: string;
  attrs?: string;
}) => {
  const Content = useMemo(() => {
    const { lang } = props;
    const nextProps = { ...props };
    nextProps.content = formatCode(props.content);

    if (lang) {
      const ShikiHighLighter: any = lazy(() =>
        import('./ShikiHighlighter').then((mod) => ({
          default: mod.ShikiHighlighter,
        })),
      );

      return (
        <Suspense fallback={<BlockLoading>CodeBlock Loading...</BlockLoading>}>
          <ShikiHighLighter {...nextProps} />
        </Suspense>
      );
    }

    return (
      <pre className="bg-gray-800 text-white p-4 rounded">
        <code>{nextProps.content}</code>
      </pre>
    );
  }, [props]);

  return <>{Content}</>;
};

// 格式化代码：移除多余缩进
function formatCode(code: string): string {
  const lines = code.split('\n');
  let minIndent = Number.MAX_SAFE_INTEGER;

  lines.forEach((line) => {
    if (line.trim().length > 0) {
      const leadingSpaces = line.match(/^ */)?.[0].length;
      if (leadingSpaces !== undefined) minIndent = Math.min(minIndent, leadingSpaces);
    }
  });

  if (minIndent === Number.MAX_SAFE_INTEGER) return code;

  return lines.map((line) => (line.trim().length > 0 ? line.slice(minIndent) : line)).join('\n');
}

// Loading 组件
export const BlockLoading = (props: any) => {
  return (
    <div
      className={cn(
        'flex h-[500px] items-center justify-center rounded-lg bg-slate-100 text-sm dark:bg-neutral-800',
        props.className,
      )}
      style={props.style}
    >
      {props.children}
    </div>
  );
};
