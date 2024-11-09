'use client';

import { useParams } from 'next/navigation';
import { AnimatePresence, m } from 'framer-motion';

import { AnimatedLogo } from './AnimatedLogo';

import type { PostMap } from '@/core';

const animationProps = {
  initial: {
    opacity: 0,
    y: 20,
  },
  exit: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,

    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

export const HeaderMeta = ({ postDataMap }: { postDataMap: PostMap }) => {
  const params = useParams();
  const postId = params.nid as string;
  console.log(postId);

  const postData = postDataMap[postId];
  console.log(postData);

  return (
    <AnimatePresence>
      {postData && (
        <m.div
          className="absolute inset-0 flex min-w-0 items-center justify-between gap-3 px-0 lg:px-16"
          data-testid="header-meta"
          {...animationProps}
        >
          <div className="flex min-w-0 shrink grow flex-col">
            <small className="min-w-0 truncate">
              <span className="text-gray-600/60 dark:text-gray-300/60">{postData.tag}</span>
            </small>
            <h2 className="min-w-0 truncate text-[1.2rem] font-medium leading-normal">
              {postData.title}
            </h2>
          </div>

          <div className=" min-w-0 shrink-[5] flex-col text-right leading-5 flex">
            <AnimatedLogo forcePlay={true} />
            <span className="font-medium sr-only">{'zwの小站'}</span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};
