'use server';

import { Metadata } from 'next';

import {
  NoteTitle,
  NoteDateMeta,
  IndentArticleContainer,
  NoteMarkdown,
  PaperLayout,
  PageTransition,
} from './pageExtra';

import { type PostItem as PostItemType, buildPostData } from '@/core';
import { LayoutRightSidePortal } from '@/providers/shared/LayoutRightSideProvider';
import { ArticleRightAside } from '@/components/modules/shared/ArticleRightAside';
import { Signature } from '@/components/modules/shared/signature';

const { postDataMap } = buildPostData();

export type PageInnerProps = { postData: PostItemType };

export const generateMetadata = async ({ params }: { params: any }): Promise<Metadata> => {
  try {
    const { nid } = params;

    const postData = postDataMap[nid];
    const { title, summary } = postData;

    return {
      authors: postData.authors?.map((author) => ({
        name: author,
      })),

      title: { absolute: title },
      description: summary,
      alternates: { canonical: `/notes/${nid}` },
      openGraph: {
        authors: postData.authors,
        title: postData.title,
        description: postData.summary,
        type: 'article',
        url: `/notes/${nid}`,
        images: [
          {
            url: `/api/og?title=${postData.title}&tag=${postData.tag}`,
            alt: postData.title,
          },
        ],
      },
    } satisfies Metadata;
  } catch {
    return {};
  }
};

export default async function Page({ params }: { params: Record<string, any> }) {
  const { nid } = params;
  const postData = postDataMap[nid];

  return (
    <PageTransition>
      <PaperLayout>
        <PageInner postData={postData} />
      </PaperLayout>
    </PageTransition>
  );
}

const PageInner = ({ postData }: PageInnerProps) => (
  <>
    <div>
      <NoteTitle title={postData.title} />
      <span className="flex flex-wrap items-center text-sm text-neutral-content/60">
        <NoteDateMeta
          createdAt={postData.createdAt!}
          updatedAt={postData.updatedAt!}
          modified={postData.modified}
        />
      </span>
    </div>
    <IndentArticleContainer>
      <NoteMarkdown text={postData.text} />
      <div className="signature-animated my-2 flex w-full justify-end" data-hide-print="true">
        <Signature />
      </div>
      <LayoutRightSidePortal>
        <ArticleRightAside></ArticleRightAside>
      </LayoutRightSidePortal>
    </IndentArticleContainer>
  </>
);
