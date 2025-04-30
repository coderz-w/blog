'use server';

import { Metadata } from 'next';

import {
  NoteTitle,
  IndentArticleContainer,
  NoteMarkdown,
  PaperLayout,
  PageTransition,
} from './pageExtra';

import dayjs from '@/lib/dayjs';
import { MdiClockOutline } from '@/components/icons/clock';
import { type PostItem as PostItemType, getPostData } from '@/core';
import { LayoutRightSidePortal } from '@/providers/shared/LayoutRightSideProvider';
import { ArticleRightAside } from '@/components/modules/shared/ArticleRightAside';
import Gisus from '@/components/modules/comment/Giscus';
import { getUserLocale } from '@/lib/getLocale';
import localeValues from '@/locale';
import { Signature } from '~/signature';
import { seo } from '~/seo';

const { postDataMap } = await getPostData();

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
  const lang = getUserLocale();

  return (
    <>
      <PageTransition>
        <PaperLayout>
          <PageInner postData={postData} />
        </PaperLayout>
        <Gisus lang={lang} />
      </PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: postData.title,
            description: postData.summary,
            datePublished: postData.createdAt,
            dateModified: postData.updatedAt,
            author: postData.authors?.map((name) => ({
              '@type': 'Person',
              name,
            })),
            image: postData.coverImage,
            url: `${seo.url}notes/${nid}`,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${seo.url}notes/${nid}`,
            },
          }),
        }}
      />
    </>
  );
}

const PageInner = ({ postData }: PageInnerProps) => {
  const lang = getUserLocale();
  const notesLocale = localeValues[lang].notes;

  return (
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
          <ArticleRightAside locale={notesLocale} />
        </LayoutRightSidePortal>
      </IndentArticleContainer>
    </>
  );
};

const NoteDateMeta = ({
  createdAt,
  updatedAt,
  modified,
}: {
  createdAt: Date;
  updatedAt: Date;
  modified: boolean;
}) => {
  const lang = getUserLocale();
  const notesLocale = localeValues[lang].notes;

  const isZh = lang === 'zh';
  const formatDate = (date: Date) =>
    isZh
      ? dayjs(date).format('YYYY 年 M 月 D 日')
      : dayjs(date).locale('en').format('MMMM D, YYYY');

  return (
    <span className="inline-flex items-center space-x-1">
      <MdiClockOutline />
      <time className="font-semibold text-sm font-mono">
        {formatDate(createdAt)}
        {modified && (
          <>
            &nbsp;&nbsp;{notesLocale['Updated on']} {formatDate(updatedAt)}
          </>
        )}
      </time>
    </span>
  );
};
