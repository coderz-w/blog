import { cn } from '@/lib/helper';

export const TwoColumnLayout = ({
  children,
  leftContainerClassName,
  rightContainerClassName,
  className,
}: {
  children:
    | [React.ReactNode, React.ReactNode]
    | [React.ReactNode, React.ReactNode, React.ReactNode];

  leftContainerClassName?: string;
  rightContainerClassName?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative mx-auto block size-full min-w-0 max-w-[1800px] flex-col flex-wrap items-center lg:flex lg:flex-row',
        className,
      )}
      style={{ padding: '0 20px' }}
    >
      {children.slice(0, 2).map((child, i) => (
        <div
          key={i}
          className={cn(
            'flex w-full flex-col center lg:h-auto lg:w-1/2',
            i === 0 ? leftContainerClassName : rightContainerClassName,
          )}
        >
          <div className="relative max-w-full lg:max-w-2xl">{child}</div>
        </div>
      ))}

      {children[2]}
    </div>
  );
};
