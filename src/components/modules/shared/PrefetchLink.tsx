import Link from 'next/link';
import { useState, useCallback } from 'react';

interface PrefetchLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
}

export const PrefetchLink: React.FC<PrefetchLinkProps> = ({ href, children, ...props }) => {
  const [prefetch, setPrefetch] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setPrefetch(true);
  }, []);

  return (
    <Link href={href} prefetch={prefetch} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </Link>
  );
};
