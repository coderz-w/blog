import jsonData from '@md/index.json';
import { join } from 'node:path';

import { symbolsTime, symbolsCount } from '@/lib/count';
import { getFirstGitCommitTime, getLastGitUpdateTime } from '@/lib/git';

export type PostItem = {
  path: string;
  rawFilePath: string;
  text: string;
  count: string;
  readingTime: string;
  title: string;
  tag: string;
  updatedAt: Date | null;
  createdAt: Date | null;
  modified: boolean;
  coverImage: string;
  summary?: string;
};

export type PostJsonType = {
  path: string;
  title: string;
  tag: string;
  coverImage: string;
  summary?: string;
};
export type PostMap = Record<string, PostItem>;

export function importMarkdownFile(path: string) {
  // 使用 require.context 获取所有 markdown 文件
  const markdownContext = (require as any).context('../../markdown', true, /\.md$/);

  return markdownContext(path);
}

export function buildPostData() {
  const postDataMap: PostMap = {};
  const postDataList: PostItem[] = [];

  function processPostItem(item: PostJsonType) {
    const itemInfo = {} as PostItem;
    const file = importMarkdownFile(`./${item.path}`);
    itemInfo.title = item.title;
    itemInfo.tag = item.tag;
    itemInfo.path = item.path.replace('.md', '');
    itemInfo.rawFilePath = `./${item.path}`;
    itemInfo.summary = item.summary;
    itemInfo.coverImage = item.coverImage.startsWith('http')
      ? item.coverImage
      : `/postCoverImage/${item.coverImage}`;

    itemInfo.text = file;
    itemInfo.count = symbolsCount(file);
    itemInfo.readingTime = symbolsTime(file, 0, 200);
    itemInfo.updatedAt = getLastGitUpdateTime(join('markdown/', item.path));
    itemInfo.createdAt = getFirstGitCommitTime(join('markdown/', item.path));

    itemInfo.modified =
      itemInfo.updatedAt && itemInfo.createdAt
        ? itemInfo.updatedAt.getTime() !== itemInfo.createdAt.getTime()
        : false;

    postDataMap[itemInfo.path] = itemInfo;
    postDataList.push(itemInfo);
  }

  jsonData.forEach((postJsonItem: PostJsonType) => {
    processPostItem(postJsonItem);
  });

  postDataList.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }

    return 0;
  });

  return { postDataMap, postDataList };
}
