import { memo } from 'react';

import { PostItemHoverOverlay } from './PostItemHoverOverlay';
import { PrefetchLink } from '../shared/PrefetchLink';

import dayjs from '@/lib/dayjs';
import { MdiClockOutline } from '@/components/icons/clock';
import { FeHash } from '@/components/icons/fa-hash';
import type { PostItem as PostItemType } from '@/core';

export const PostItem = memo<{ data: PostItemType }>(function PostItem({ data }) {
  const postLink = `/notes/${data.path}`;

  return (
    <PrefetchLink
      href={postLink}
      className="relative flex flex-col py-8 focus-visible:!shadow-none gap-2"
    >
      <PostItemHoverOverlay />
      <h2 className="relative text-balance break-words text-2xl font-medium">{data.title}</h2>

      <div className="post-meta-bar mt-2 flex select-none flex-wrap items-center justify-start gap-8 text-base-content/60">
        <span className=" flex min-w-0 items-center space-x-1 text-sm">
          <MdiClockOutline />
          {data.createdAt ? dayjs(data.createdAt).format('YYYY 年 M 月 D 日') : '1999 年 9 月 9 日'}
          {data.modified && <>&nbsp;&nbsp;(已编辑)</>}
        </span>
        <span className="flex min-w-0 items-center space-x-1 text-sm">
          <FeHash className="translate-y-[0.5px]" />
          <p>{data.tag}</p>
        </span>
      </div>
    </PrefetchLink>
  );
});
