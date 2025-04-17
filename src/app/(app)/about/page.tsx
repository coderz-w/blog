import { NoteMarkdown } from '../notes/[nid]/pageExtra';

import { getUserLocale } from '@/lib/getLocale';
import localeValues from '@/locale';
import content from '~/introduction.md';

export default function About() {
  const lang = getUserLocale();
  const aboutLocale = localeValues[lang].about;

  return (
    <div>
      <header className="prose font-mono !mb-2">
        <h2>{aboutLocale.about}</h2>
      </header>

      <main className="flex w-full flex-col with-indent with-serif prose relative max-w-full">
        <NoteMarkdown text={content} />
      </main>
    </div>
  );
}
