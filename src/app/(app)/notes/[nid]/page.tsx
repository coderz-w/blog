'use server';

import {
  NoteTitle,
  NoteDateMeta,
  IndentArticleContainer,
  NoteMarkdown,
  PaperLayout,
  PageTransition,
} from './pageExtra';

import { LayoutRightSidePortal } from '@/providers/shared/LayoutRightSideProvider';
import { ArticleRightAside } from '@/components/modules/shared/ArticleRightAside';

export default async function Page({ params }: { params: Record<string, any> }) {
  const { nid } = params;
  console.log('id', nid);

  return (
    <PageTransition>
      <PaperLayout>
        <PageInner />
      </PaperLayout>
    </PageTransition>
  );
}

const PageInner = () => (
  <>
    <div>
      <NoteTitle />
      <span className="flex flex-wrap items-center text-sm text-neutral-content/60">
        <NoteDateMeta />
      </span>
    </div>
    <IndentArticleContainer>
      <NoteMarkdown />
      <LayoutRightSidePortal>
        <ArticleRightAside></ArticleRightAside>
      </LayoutRightSidePortal>
    </IndentArticleContainer>
  </>
);
