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
import { Signature } from '@/components/modules/shared/signature';

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
      <div className="signature-animated my-2 flex w-full justify-end" data-hide-print="true">
        <Signature />
      </div>
      <LayoutRightSidePortal>
        <ArticleRightAside></ArticleRightAside>
      </LayoutRightSidePortal>
    </IndentArticleContainer>
  </>
);
