// AnimatedPostItem.tsx
'use client';

import React from 'react';
import { m } from 'framer-motion';

import { PostItem } from '@/components/modules/list/PostItem';
import type { PostItem as PostItemType } from '@/core';

interface AnimatedPostItemProps {
  item: PostItemType;
  index: number;
  locale: Record<string, string>;
}

const AnimatedPostItem: React.FC<AnimatedPostItemProps> = ({ item, index, locale }) => {
  return (
    <m.li
      initial={{ y: 50, opacity: 0.01 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: {
          delay: index * 0.1,
          type: 'spring',
          damping: 10,
          stiffness: 100,
        },
      }}
      key={item.path}
    >
      <PostItem locale={locale} data={item} />
    </m.li>
  );
};

export default AnimatedPostItem;
