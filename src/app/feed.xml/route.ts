import RSS from 'rss';

import { siteUrl } from '~/seo';
import { buildPostData } from '@/core';

const { postDataList } = buildPostData();

export async function GET() {
  const feed = new RSS({
    title: 'zhw blog',
    description: '记录我的生活',
    site_url: siteUrl.toString(),
    feed_url: `${siteUrl}/feed.xml`,
    language: 'zh-CN',
    image_url: `${siteUrl}/api/og`,
    generator: 'Next 14',
  });

  postDataList.forEach((post) => {
    feed.item({
      title: post.title,
      guid: post.title,
      url: `${siteUrl}/notes/${post.title}`,
      description: post.summary ?? '',
      date: post.createdAt!,
      enclosure: {
        url: post.coverImage,
        type: 'image/jpeg',
      },
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'content-type': 'application/xml',
    },
  });
}
