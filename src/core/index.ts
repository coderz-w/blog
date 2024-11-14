import jsonData from '@md/index.json';
import { join } from 'node:path';
import { existsSync, writeFileSync } from 'node:fs';

import { symbolsTime, symbolsCount } from '@/lib/count';
import { getFirstGitCommitTime, getLastGitUpdateTime } from '@/lib/git';

export type PostItem = {
  authors: string[];
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
  imageUrls: string[];
};

export type PostJsonType = {
  authors: string[];
  path: string;
  title: string;
  tag: string;
  coverImage: string;
  summary?: string;
};

export type PostMap = Record<string, PostItem>;

const imgRegex = /!\[.*?\]\((http[s]?:\/\/[^\s\)]+\.(?:jpg|jpeg|png|gif|bmp|svg|webp|tiff|ico))\)/g;

export function importMarkdownFile(path: string) {
  const markdownContext = (require as any).context('../../markdown', true, /\.md$/);

  return markdownContext(path);
}

export function importJsonFile(path: string) {
  const jsonContext = (require as any).context('../../markdown', true, /\.json$/);

  return jsonContext(path);
}

export function writeOutputFile(data: { postDataMap: PostMap; postDataList: PostItem[] }) {
  const outputContent = {
    postDataMap: data.postDataMap,
    postDataList: data.postDataList,
  };

  const outputPath = join(process.cwd(), 'markdown/output.json');
  writeFileSync(outputPath, JSON.stringify(outputContent, null, 2));

  console.log(`Data written to ${outputPath}`);
}

export function buildPostData() {
  const postDataMap: PostMap = {};
  const postDataList: PostItem[] = [];

  function processPostItem({ authors, title, tag, path, coverImage, summary }: PostJsonType) {
    const file = importMarkdownFile(`./${path}`);
    const createdAt = getFirstGitCommitTime(join('markdown/', path));
    const updatedAt = getLastGitUpdateTime(join('markdown/', path));
    let match;
    const imageUrls = [];

    while ((match = imgRegex.exec(file)) !== null) {
      imageUrls.push(match[1]);
    }

    const postItem: PostItem = {
      authors,
      title,
      tag,
      path: path.replace('.md', ''),
      rawFilePath: `./${path}`,
      summary,
      coverImage: coverImage.startsWith('http') ? coverImage : `/postCoverImage/${coverImage}`,
      text: file,
      count: symbolsCount(file),
      readingTime: symbolsTime(file, 0, 200),
      imageUrls: imageUrls,
      createdAt,
      updatedAt,
      modified: updatedAt && createdAt ? updatedAt.getTime() !== createdAt.getTime() : false,
    };

    postDataMap[postItem.path] = postItem;
    postDataList.push(postItem);
  }

  jsonData.forEach((postJsonItem) => processPostItem(postJsonItem));

  postDataList.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

  const result = { postDataMap, postDataList };
  writeOutputFile(result);

  return result;
}

export async function getPostData(): Promise<{ postDataMap: PostMap; postDataList: PostItem[] }> {
  const outputPath = join(process.cwd(), 'markdown/output.json');

  if (existsSync(outputPath)) {
    const { postDataMap, postDataList } = importJsonFile('./output.json');
    console.log('Using cached post data.');

    return { postDataMap, postDataList };
  } else {
    console.log('Output file not found, generating post data...');

    return buildPostData();
  }
}
