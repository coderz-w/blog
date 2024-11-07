import Link from 'next/link';
import { memo } from 'react';

import { PostItemHoverOverlay } from './PostItemHoverOverlay';

import { MdiClockOutline } from '@/components/icons/clock';
import { FeHash } from '@/components/icons/fa-hash';

export const PostItem = memo<{ data: any }>(function PostItem({ data }) {
  const categorySlug = data.category?.slug;
  const postLink = `/posts/${categorySlug}/${data.slug}`;

  return (
    <Link href={postLink} className="relative flex flex-col py-8 focus-visible:!shadow-none">
      <PostItemHoverOverlay />
      <h2 className="relative text-balance break-words text-2xl font-medium">{data.title}</h2>

      <div className="post-meta-bar mt-2 flex select-none flex-wrap items-center justify-start gap-8 text-base-content/60">
        <span className=" flex min-w-0 items-center space-x-1 text-sm">
          <MdiClockOutline />
          <p>2024 年 6 月 4 日 星期二</p>
        </span>
        <span className="flex min-w-0 items-center space-x-1 text-sm">
          <FeHash className="translate-y-[0.5px]" />
          <p>技术/react</p>
        </span>
      </div>
    </Link>
  );
});
