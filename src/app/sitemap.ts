import { MetadataRoute } from 'next';

import { siteUrl } from '~/seo';
import { getPostData } from '@/core';

const { postDataList } = await getPostData();

export default function sitemap(): MetadataRoute.Sitemap {
  const postSitemap = postDataList.map((post) => ({
    url: `${siteUrl}/notes/${post.title}`,
    lastModified: post.updatedAt!,
  }));

  return [
    { url: `${siteUrl}` },
    { url: `${siteUrl}/list` },
    { url: `${siteUrl}/friends` },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/projects` },
    ...postSitemap,
  ];
}
