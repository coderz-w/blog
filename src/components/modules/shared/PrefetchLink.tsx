'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const loadedImages = new Set<string>();

interface PrefetchLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  preFetchImages: string[];
}

export const PrefetchLink: React.FC<PrefetchLinkProps> = ({
  href,
  preFetchImages,
  children,
  ...props
}) => {
  const [preloading, setPreloading] = useState<(() => void)[]>([]);
  const router = useRouter();

  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={() => {
        router.prefetch(href);
        if (!preFetchImages || preFetchImages.length < 1) return;

        const p: (() => void)[] = [];

        for (const image of preFetchImages) {
          const remove = prefetchImage(image);
          if (remove) p.push(remove);
        }

        setPreloading(p);
      }}
      onMouseLeave={() => {
        for (const remove of preloading) {
          remove();
        }

        setPreloading([]);
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

function prefetchImage(image: string) {
  if (loadedImages.has(image)) return;

  const img = new Image();
  img.decoding = 'async';
  img.fetchPriority = 'low';
  img.src = image;

  let done = false;

  img.onload = img.onerror = () => {
    done = true;
    loadedImages.add(image);
  };

  return () => {
    if (done) return;
    img.src = '';
  };
}
